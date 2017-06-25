class Ebook < ApplicationRecord
  require 'httparty'
  require 'json'

  mount_uploader :content_href, EbooksUploader

  # Downloads the ebook from S3, unzips the epub file, and
  # returns a JSONified HASH that maps file paths to their
  # contents
  def self.jsonify_ebook(ebook)
    epub_files = Hash.new("file not found!")
    input = HTTParty.get("#{ebook.content_href}").body
    Zip::InputStream.open(StringIO.new(input)) do |io|
      while entry = io.get_next_entry
        epub_files[entry.name] = io.read
      end
    end


    # epub_files.to_json
    epub_files
  end

  # TODO: implement get_ebook_state()
  def self.ebook_state(ebook)
  end

end
