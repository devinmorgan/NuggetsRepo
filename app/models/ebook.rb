class Ebook < ApplicationRecord
  require 'httparty'
  require 'json'
  require 'nokogiri'

  mount_uploader :content_href, EbooksUploader

  CONTAINER_XML_PATH = "META-INF/container.xml"
  CONTAINER_XML_NAMESPACE = "urn:oasis:names:tc:opendocument:xmlns:container"
  XPATH_TO_CONTENT_OPF = "//xmlns:rootfile/@full-path"
  def jsonify_ebook
    # Load the epub contents from its stored URL
    epub_files = get_epub_files(content_href.to_s)

    # Parse the XML contents of the container.xml file
    container_xml_doc = Nokogiri::XML(epub_files[CONTAINER_XML_PATH])

    # Determine the absolute path of the content.opf file
    # and parse it
    content_opf_path = container_xml_doc.xpath(XPATH_TO_CONTENT_OPF, 'xmlns' => CONTAINER_XML_NAMESPACE)
    content_opf_doc = Nokogiri::XML(epub_files[content_opf_path.to_s])
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

