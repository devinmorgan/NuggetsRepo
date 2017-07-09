class Ebook < ApplicationRecord
  require 'nokogiri'
  require 'zip'
  require 'rubygems'
  require 'fog-aws'
  require 'fileutils'
  require 'ebooks_helper'

  mount_uploader :content_href, EbooksUploader

  #======================================================================
  # PUBLIC: Functions for processing an epub when uploaded
  #======================================================================
  def self.process_epub(ebook)
    unzipped_contents_path = unzip_epub(ebook.content_href)
    convert_html_to_xhtml(unzipped_contents_path)
    store_epub_in_s3(unzipped_contents_path, ebook)
    create_spine_hrefs(unzipped_contents_path, ebook)
    delete_local_files(unzipped_contents_path)
  end

  #======================================================================
  # PUBLIC: Functions for processing an epub when uploaded
  #======================================================================
  def self.delete(ebook)
    remove_epub_from_s3(ebook)
    ebook.destroy
  end

  private

  #======================================================================
  # PRIVATE: Functions for processing an epub when uploaded
  #======================================================================

  # Filename.opf related constants
  OPF_PACKAGE_NAMESPACE = "http://www.idpf.org/2007/opf"
  XPATH_TO_MANIFEST_ITEM = "/xmlns:package//xmlns:manifest//xmlns:item"
  XPATH_TO_MANIFEST_ITEM_ID = "/xmlns:package//xmlns:manifest//xmlns:item/@id"
  XPATH_TO_MANIFEST_ITEM_HREF = "/xmlns:package//xmlns:manifest//xmlns:item/@href"
  XPATH_TO_SPINE_ITEMREF_IDREF = "/xmlns:package//xmlns:spine//xmlns:itemref/@idref"
  HREF_ATTRIBUTE = "href"
  HTML_FILE_EXTENSION = ".html"
  XHTML_FILE_EXTENSION = ".xhtml"

  # Unzips the epub file, extracts its contents, stores the files
  # in the same directory as the .epub file. Deletes the .epub file
  # once the extraction process is complete
  def self.unzip_epub(epub_file)
    # determine the path that the epub was stored
    unzipped_content_dir_path = EbooksHelper.dir_of_path(epub_file.path)

    # unzip the epub file
    Zip::File.open(epub_file.path) do |zip_file|
      zip_file.each do |entry|
        # ensure that the directory for each file in the epub exists
        entry_dir = File.dirname(unzipped_content_dir_path + entry.name)
        FileUtils.mkdir_p(entry_dir) unless File.directory?(entry_dir)

        # extract the content of each zipped entry and store it locally
        entry.extract(unzipped_content_dir_path + entry.name)
      end
    end

    # delete the original epub once all of the files have been extracted
    File.delete(epub_file.path)
    unzipped_content_dir_path
  end

  # Changes the file type of each .html file to .xhtml. It also
  # replaces every instance of the substring .html into .xhmtl
  # in each spine.item.href attribute and each guid.reference.href
  # attribute in the .opf file.
  def self.convert_html_to_xhtml(epub_contents_dir)
    content_opf_rel_path = EbooksHelper.content_opf_path(epub_contents_dir)
    content_opf_abs_path = epub_contents_dir + content_opf_rel_path
    content_opf_doc = EbooksHelper.content_opf_doc(content_opf_abs_path)
    manifest_items = content_opf_doc.xpath(XPATH_TO_MANIFEST_ITEM, EbooksHelper::XMLNS => OPF_PACKAGE_NAMESPACE)

    # In the manifest, change all the file href file extensions
    # from .html to .xhtml. Then write (save) these changes to
    # original xml file
    manifest_items.each do |item|
      item[HREF_ATTRIBUTE] = item[HREF_ATTRIBUTE].sub(HTML_FILE_EXTENSION, XHTML_FILE_EXTENSION)
    end
    File.write(content_opf_abs_path, content_opf_doc.to_xml)

    # Rename the .html extension of all files in the epub to be .xhtml
    EbooksHelper.recurse_through_directory(epub_contents_dir) do |abs_file_path|
      xhtml_name = abs_file_path.sub(HTML_FILE_EXTENSION, XHTML_FILE_EXTENSION)
      File.rename(abs_file_path, xhtml_name)
    end
  end

  # Moves the content located in the directory of file.path
  # to s3 with a similar path.
  def self.store_epub_in_s3(epub_contents_dir, ebook)
    connection = EbooksHelper.new_fog_storage_connection
    directory = connection.directories.get(ENV['AWS_BUCKET'])
    EbooksHelper.recurse_through_directory(epub_contents_dir) do |abs_file_path|
      # Upload actual files to S3 with the path given by
      # "#{model.class.to_s.underscore}/#{ebook.id}/content
      f = File.open(abs_file_path)
      directory.files.create(
          :key => abs_file_path[abs_file_path.index(ebook.class.to_s.underscore)..-1],
          :body => f,
          :public => true
      )
      f.close
    end
  end

  # Creates the spines-href array, which is an array containing the url
  # to each chapter's location in s3, according to the order they are
  # found in the spine
  def self.create_spine_hrefs(epub_contents_dir, ebook)
    # Parse the .opf file for the manifest items
    content_opf_path = EbooksHelper.content_opf_path(epub_contents_dir)
    content_opf_doc = EbooksHelper.content_opf_doc(epub_contents_dir + content_opf_path)

    # Parse the .opf file for the manifest data
    manifest_item_ids = content_opf_doc.xpath(
        XPATH_TO_MANIFEST_ITEM_ID, EbooksHelper::XMLNS => OPF_PACKAGE_NAMESPACE)
    manifest_item_hrefs = content_opf_doc.xpath(
        XPATH_TO_MANIFEST_ITEM_HREF, EbooksHelper::XMLNS => OPF_PACKAGE_NAMESPACE)

    # Create a hash that maps id's to their epub href's
    id_to_relative_path = Hash.new("id not found!")
    manifest_item_ids.zip(manifest_item_hrefs).each do |id, href|
      opf_abs_path = content_opf_path[0..content_opf_path.rindex('/')]
      id_to_relative_path[id.to_s] = opf_abs_path + href.to_s
    end

    # Create an array that contains the urls for each of the doucments
    # in the manifest's spine and in their original order
    build_chapter_url = lambda do |chapter_path|
      ENV["AWS_BUCKET_URL"] + epub_contents_dir[epub_contents_dir.index(ebook.class.to_s.underscore)..-1] + chapter_path
    end
    spine_urls = Array.new
    manifest_itemref_idrefs = content_opf_doc.xpath(
        XPATH_TO_SPINE_ITEMREF_IDREF, EbooksHelper::XMLNS => OPF_PACKAGE_NAMESPACE)
    manifest_itemref_idrefs.each do |id|
      spine_urls.push(build_chapter_url.call(id_to_relative_path[id.to_s]))
    end

    # Transform the spine url into string of comma separated values (to be saved in the DB)
    spine_urls_str = begin
      stringify = ""
      spine_urls.each { |url| stringify += url + "," }
      stringify[0...-1]
    end

    # Convert spine_urls to a string and save it
    ebook = find(ebook.id)
    ebook.update_attributes({:spine_urls => spine_urls_str, :spine_index => 0})
  end

  def self.delete_local_files(epub_contents_dir)
    FileUtils.rm_rf(epub_contents_dir[0...epub_contents_dir.rindex(CONTENT_DIRECTORY)])
  end

  #======================================================================
  # PRIVATE: Functions for processing an epub when deleting it
  #======================================================================

  # Constants regarding paths of temp epub storage
  CONTENT_DIRECTORY = "content"

  # Deletes all on S3 related to ebook
  def self.remove_epub_from_s3(ebook)
    connection = EbooksHelper.new_fog_storage_connection
    ebook_sub_dir = ebook.class.to_s.underscore + "/" + ebook.id.to_s
    directory = connection.directories.get(ENV["AWS_BUCKET"], prefix: ebook_sub_dir )
    directory.files.each do |file|
      file.destroy
    end
  end

end

