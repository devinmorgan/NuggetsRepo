class Ebook < ApplicationRecord
  mount_uploader :content_href, EbooksUploader
end
