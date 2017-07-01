class Ebook < ApplicationRecord
  require 'httparty'
  require 'json'
  require 'nokogiri'

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
    epub_files = get_epub_files(content_href.to_s)

    # Parse the XML contents of the container.xml file
    container_xml_doc = Nokogiri::XML(epub_files[CONTAINER_XML_PATH])

    # Determine the absolute path of the content.opf file
    # and parse it
    content_opf_path = container_xml_doc.xpath(XPATH_TO_CONTENT_OPF_FILE_PATH, XMLNS => CONTAINER_XML_NAMESPACE).to_s
    content_opf_doc = Nokogiri::XML(epub_files[content_opf_path])

    # Parse the .opf file for the manifest data
    manifest_item_ids = content_opf_doc.xpath(XPATH_TO_MANIFEST_ITEM_ID, XMLNS => OPF_PACKAGE_NAMESPACE)
    manifest_item_hrefs = content_opf_doc.xpath(XPATH_TO_MANIFEST_ITEM_HREF, XMLNS => OPF_PACKAGE_NAMESPACE)
    id_to_abs_href = Hash.new("file not found!")
    manifest_item_ids.zip(manifest_item_hrefs).each do |id, href|
      opf_abs_path = content_opf_path[0..content_opf_path.rindex('/')]
      abs_href = opf_abs_path + href.to_s
      id_to_abs_href[id.to_s] = abs_href
    end

    # TODO: parse the .opf file for the spine data (which tells you in what order you should display the manifest data)
    manifest_itemref_idrefs = content_opf_doc.xpath(XPATH_TO_SPINE_ITEMREF_IDREF, XMLNS => OPF_PACKAGE_NAMESPACE)
    content_array = Array.new
    manifest_itemref_idrefs.each do |id|
      content_array.push epub_files[id_to_abs_href[id.to_s]]
    end
    content_array
  end

  def ebook_state
    # TODO: implement get_ebook_state()
  end

  private

  def get_epub_files(epub_url)
    # Download the epub with it's content_hre
    input = HTTParty.get(epub_url).body

    # Create a Hash of the epub's internal file structure
    epub_files = Hash.new("file not found!")
    Zip::InputStream.open(StringIO.new(input)) do |io|
      while (file = io.get_next_entry)
        epub_files[file.name] = io.read
      end
    end

    # Return the file structure Hash
    epub_files
  end

end

