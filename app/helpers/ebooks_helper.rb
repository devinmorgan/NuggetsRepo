module EbooksHelper
  require 'nokogiri'

  # dir_of_path returns the directory of the object located
  # at path. Returns the empty string if the object in the
  # root directory
  def self.dir_of_path(path)
    if path.rindex('/') == nil
      return ""
    else
      return path[0..path.rindex('/')]
    end
  end


  # Invokes the passed block on each file found in the
  # tree rooted at the dir_path directory
  def self.recurse_through_directory(dir_path, &block)
    Dir.foreach(dir_path) do |file|
      # Ignore the current directory and parent directory
      next if file == '.' or file == '..'

      abs_file_path = dir_path + file
      if File.directory?(abs_file_path)
        # Recurse on directories
        recurse_through_directory(abs_file_path+"/", &block)
      else
        # Perform the desired block on current file
        yield(abs_file_path)
      end
    end
  end

  # Namespace constants
  XMLNS = 'xmlns'

  # Container.xml related constants
  CONTAINER_XML_PATH = "META-INF/container.xml"
  CONTAINER_XML_NAMESPACE = "urn:oasis:names:tc:opendocument:xmlns:container"
  XPATH_TO_CONTENT_OPF_FILE_PATH = "/xmlns:container//xmlns:rootfile/@full-path"

  # Scans the epub's container.xml file and returns the path
  # to the .opf file
  def self.get_content_opf_path(epub_contents_dir)
    # Parse the XML contents of the container.xml file
    f = File.open(epub_contents_dir + CONTAINER_XML_PATH, 'rb')
    container_xml_doc = Nokogiri::XML(f.read)
    f.close

    # Determine the absolute path of the content.opf file
    container_xml_doc.xpath(XPATH_TO_CONTENT_OPF_FILE_PATH, XMLNS => CONTAINER_XML_NAMESPACE).to_s
  end

end