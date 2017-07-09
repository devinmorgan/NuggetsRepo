# encoding: utf-8

class EbooksUploader < CarrierWave::Uploader::Base

  # Include RMagick or MiniMagick support:
  # include CarrierWave::RMagick
  include CarrierWave::MiniMagick

  # Include the sprockets-rails helper for Rails 4+ asset pipeline compatibility
  include Sprockets::Rails::Helper

  # Choose what kind of storage to use for this uploader:
  # storage : file
  storage :file

  # Override the directory where uploaded files will be stored.
  # This is a sensible default for uploaders that are meant to be mounted:
  def store_dir
    "uploads/tmp/#{model.class.to_s.underscore}/#{model.id}/#{Ebook::CONTENT_DIRECTORY}"
  end

  # Add a white list of extensions which are allowed to be uploaded.
  # For images ou might use something like this:
  def extension_whitelist
    %w(txt epub)
  end

end