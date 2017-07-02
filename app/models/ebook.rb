class Ebook < ApplicationRecord
  require 'httparty'
  require 'json'
  require 'nokogiri'
  require 'zip'

  mount_uploader :content_href, EbooksUploader

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

  def jsonify_ebook
    # Load the epub contents from its stored URL
    extract_epub_content(content_href.to_s)

    # Parse the XML contents of the container.xml file
    container_xml_doc = Nokogiri::XML(read_file_contents_at_path(CONTAINER_XML_PATH))

    # Determine the absolute path of the content.opf file
    # and parse it
    content_opf_path = container_xml_doc.xpath(XPATH_TO_CONTENT_OPF_FILE_PATH, XMLNS => CONTAINER_XML_NAMESPACE).to_s
    content_opf_doc = Nokogiri::XML(read_file_contents_at_path(content_opf_path))

    # Parse the .opf file for the manifest data
    manifest_item_ids = content_opf_doc.xpath(XPATH_TO_MANIFEST_ITEM_ID, XMLNS => OPF_PACKAGE_NAMESPACE)
    manifest_item_hrefs = content_opf_doc.xpath(XPATH_TO_MANIFEST_ITEM_HREF, XMLNS => OPF_PACKAGE_NAMESPACE)

    # Create a hash that maps id's to their epub href's
    id_to_abs_href = Hash.new("id not found!")
    manifest_item_ids.zip(manifest_item_hrefs).each do |id, href|
      opf_abs_path = content_opf_path[0..content_opf_path.rindex('/')]
      id_to_abs_href[id.to_s] = abs_path_for_temp_epub_file(opf_abs_path + href.to_s)
    end

    # TODO: parse the .opf file for the spine data (which tells you in what order you should display the manifest data)
    manifest_itemref_idrefs = content_opf_doc.xpath(XPATH_TO_SPINE_ITEMREF_IDREF, XMLNS => OPF_PACKAGE_NAMESPACE)
    content_array = Array.new
    manifest_itemref_idrefs.each do |id|
      content_array.push(id_to_abs_href[id.to_s])
    end
    content_array[1]
  end

  def ebook_state
    # TODO: implement get_ebook_state()
  end

  private

  # Temp folder constants
  EBOOK_LOCAL_DIRECTORY = "#{Rails.root}/tmp/ebook/"
  DUMMY_TEXT_FILE = "somefile.txt"

  def abs_path_for_temp_epub_file(relative_epub_path)
    EBOOK_LOCAL_DIRECTORY + relative_epub_path
  end

  def read_file_contents_at_path(relative_epub_path)
    File.open(abs_path_for_temp_epub_file(relative_epub_path), 'rb').read
  end

  # Loads the epub located at the passed url, extracts its content
  # and saves it locally in tmp/ebook/
  def extract_epub_content(epub_url)
    # Download the epub with it's content_href
    input = HTTParty.get(epub_url).body

    # create the temporary directory that will contain the epub's contents
    tmp_ebook_root_dir = File.dirname(EBOOK_LOCAL_DIRECTORY + DUMMY_TEXT_FILE)
    FileUtils.mkdir_p(tmp_ebook_root_dir) unless File.directory?(tmp_ebook_root_dir)

    # Extract the content from each epub file and store it in
    # in its corresponding temp file
    Zip::InputStream.open(StringIO.new(input)) do |io|
      while (epub_file = io.get_next_entry)
        temp_file_path = tmp_ebook_root_dir + "/" + epub_file.name

        # ensure that each file's directory already exists
        temp_file_dir = File.dirname(temp_file_path)
        FileUtils.mkdir_p(temp_file_dir) unless File.directory?(temp_file_dir)

        # create the temp file and write to it its content
        File.open(temp_file_path, "w+") do |f|
          f.write(io.read.encode('UTF-8', {
              :invalid => :replace,
              :undef   => :replace,
              :replace => '?'
          }))
        end
      end
    end
  end

end

