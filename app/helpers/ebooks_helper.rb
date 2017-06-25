module EbooksHelper
  require 'open-uri'
  def self.process_ebook(ebook)
    #TODO: implement process_ebook()
    puts "#{ebook.content_href}"
    epub = open("#{ebook.content_href}")
  end

  def self.get_ebook_state(ebook)
    #TODO: implement get_ebook_state()

  end
end
