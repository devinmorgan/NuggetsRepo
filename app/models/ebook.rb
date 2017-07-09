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

  end

  # Moves the content located in the directory of file.path
  # to s3 with a similar path.
  def self.store_epub_in_s3(epub_contents_dir, ebook)
    connection = Fog::Storage.new(
        :provider => "AWS",
        :aws_access_key_id => ENV["AWS_ACCESS_KEY_ID"],
        :aws_secret_access_key => ENV["AWS_SECRET_ACCESS_KEY"],
        :region => 'us-east-2'
    )
    directory = connection.directories.get(ENV['AWS_BUCKET'])
    recursive_upload_directory = lambda do |dir_path|
      Dir.foreach(dir_path) do |file|
        # Ignore the current directory and parent directory
        next if file == '.' or file == '..'

        abs_file_path = dir_path + file
        if File.directory?(abs_file_path)
          # Recurse on directories
          recursive_upload_directory.call(abs_file_path+"/")
        else
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
    end
    recursive_upload_directory.call(epub_contents_dir)
  end

  # Namespace constants
  XMLNS = 'xmlns'

  # Container.xml related constants
  CONTAINER_XML_PATH = "META-INF/container.xml"
  CONTAINER_XML_NAMESPACE = "urn:oasis:names:tc:opendocument:xmlns:container"
  XPATH_TO_CONTENT_OPF_FILE_PATH = "/xmlns:container//xmlns:rootfile/@full-path"

  # Filename.opf related constants
  OPF_PACKAGE_NAMESPACE = "http://www.idpf.org/2007/opf"
  XPATH_TO_MANIFEST_ITEM_ID = "/xmlns:package//xmlns:manifest//xmlns:item/@id"
  XPATH_TO_MANIFEST_ITEM_HREF = "/xmlns:package//xmlns:manifest//xmlns:item/@href"
  XPATH_TO_SPINE_ITEMREF_IDREF = "/xmlns:package//xmlns:spine//xmlns:itemref/@idref"

  # Creates the spines-href array, which is an array containing the url
  # to each chapter's location in s3, according to the order they are
  # found in the spine
  def self.create_spine_hrefs(epub_contents_dir, ebook)
    # Parse the XML contents of the container.xml file
    f = File.open(epub_contents_dir + CONTAINER_XML_PATH, 'rb')
    container_xml_doc = Nokogiri::XML(f.read)
    f.close

    # Determine the absolute path of the content.opf file
    # and parse it
    content_opf_path = container_xml_doc.xpath(
        XPATH_TO_CONTENT_OPF_FILE_PATH, XMLNS => CONTAINER_XML_NAMESPACE).to_s
    f = File.open(epub_contents_dir + content_opf_path, 'rb')
    content_opf_doc = Nokogiri::XML(f.read)
    f.close

    # Parse the .opf file for the manifest data
    manifest_item_ids = content_opf_doc.xpath(XPATH_TO_MANIFEST_ITEM_ID, XMLNS => OPF_PACKAGE_NAMESPACE)
    manifest_item_hrefs = content_opf_doc.xpath(XPATH_TO_MANIFEST_ITEM_HREF, XMLNS => OPF_PACKAGE_NAMESPACE)

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
    manifest_itemref_idrefs = content_opf_doc.xpath(XPATH_TO_SPINE_ITEMREF_IDREF, XMLNS => OPF_PACKAGE_NAMESPACE)
    manifest_itemref_idrefs.each do |id|
      spine_urls.push(build_chapter_url.call(id_to_relative_path[id.to_s]))
    end

    # Transform the spine url into string of comma separated values (to be saved in the DB)
    spine_urls_str = begin
                   stringify = ""
                   spine_urls.each do |url|
                     stringify += url + ","
                   end
                   stringify[0...-1]
    end

    # Convert spine_urls to a string and save it
    ebook = find(ebook.id)
    ebook.update_attributes({:spine_urls => spine_urls_str, :spine_index => 0})
  end

  # Constants regarding paths of temp epub storage
  CONTENT_DIRECTORY = "content"
  def self.delete_local_files(epub_contents_dir)
    FileUtils.rm_rf(epub_contents_dir[0...epub_contents_dir.rindex(CONTENT_DIRECTORY)])
  end

  #======================================================================
  # PRIVATE: Functions for processing an epub when deleting it
  #======================================================================

  def self.remove_epub_from_s3(ebook)
    connection = Fog::Storage.new(
        :provider => "AWS",
        :aws_access_key_id => ENV["AWS_ACCESS_KEY_ID"],
        :aws_secret_access_key => ENV["AWS_SECRET_ACCESS_KEY"],
        :region => 'us-east-2'
    )
    ebook_sub_dir = ebook.class.to_s.underscore + "/" + ebook.id.to_s
    directory = connection.directories.get(ENV["AWS_BUCKET"], prefix: ebook_sub_dir )
    directory.files.each do |file|
      file.destroy
    end
  end

end

