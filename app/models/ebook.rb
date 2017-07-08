class Ebook < ApplicationRecord
  require 'nokogiri'
  require 'zip'
  require 'rubygems'
  require 'fog-aws'

  mount_uploader :content_href, EbooksUploader

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
  def self.store_epub_in_s3(epub_contents_dir, model, mounted_as)
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
          # "#{model.class.to_s.underscore}/#{model.id}/content
          directory.files.create(
              :key => abs_file_path[abs_file_path.index(model.class.to_s.underscore)..-1],
              :body => File.open(abs_file_path),
              :public => true
          )
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
  def self.create_spine_hrefs(epub_contens_dir, model)
    # Parse the XML contents of the container.xml file
    container_xml_doc = Nokogiri::XML(File.open(epub_contens_dir + CONTAINER_XML_PATH, 'rb').read)

    # Determine the absolute path of the content.opf file
    # and parse it
    content_opf_path = container_xml_doc.xpath(
        XPATH_TO_CONTENT_OPF_FILE_PATH, XMLNS => CONTAINER_XML_NAMESPACE).to_s
    content_opf_doc = Nokogiri::XML(File.open(epub_contens_dir + content_opf_path, 'rb').read)

    # Parse the .opf file for the manifest data
    manifest_item_ids = content_opf_doc.xpath(XPATH_TO_MANIFEST_ITEM_ID, XMLNS => OPF_PACKAGE_NAMESPACE)
    manifest_item_hrefs = content_opf_doc.xpath(XPATH_TO_MANIFEST_ITEM_HREF, XMLNS => OPF_PACKAGE_NAMESPACE)

    # Create a hash that maps id's to their epub href's
    id_to_relative_path = Hash.new("id not found!")
    manifest_item_ids.zip(manifest_item_hrefs).each do |id, href|
      opf_abs_path = content_opf_path[0..content_opf_path.rindex('/')]
      id_to_relative_path[id.to_s] = opf_abs_path + href.to_s
    end

    build_chapter_url = lambda do |chapter_path|
      ENV["AWS_BUCKET_URL"] + epub_contens_dir[epub_contens_dir.index(model.class.to_s.underscore)..-1] + chapter_path
    end
    spine_hrefs = Array.new
    manifest_itemref_idrefs = content_opf_doc.xpath(XPATH_TO_SPINE_ITEMREF_IDREF, XMLNS => OPF_PACKAGE_NAMESPACE)
    manifest_itemref_idrefs.each do |id|
      spine_hrefs.push(build_chapter_url.call(id_to_relative_path[id.to_s]))
    end
    spine_hrefs[1]
  end

end

