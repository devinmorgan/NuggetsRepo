# encoding: utf-8

class EbooksUploader < CarrierWave::Uploader::Base
  require 'ebooks_helper.rb'

  after :store, :process_epub
  # Include RMagick or MiniMagick support:
  # include CarrierWave::RMagick
  include CarrierWave::MiniMagick

  # Include the Sprockets helpers for Rails 3.1+ asset pipeline compatibility:
  # include Sprockets::Helpers::RailsHelper
  # include Sprockets::Helpers::IsolatedHelper

  # Include the sprockets-rails helper for Rails 4+ asset pipeline compatibility
  include Sprockets::Rails::Helper

  # Choose what kind of storage to use for this uploader:
  # storage : file
  storage :file

  # Override the directory where uploaded files will be stored.
  # This is a sensible default for uploaders that are meant to be mounted:
  def store_dir
    "uploads/tmp/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
  end

  # Called after the epub file has been successfully stored locally.
  # process_ebup() unzips the epub file and extracts all of the epub's
  # content in the same directory that the epub was originally stored
  def process_epub(some_var)
    unzipped_contents_path = EbooksHelper.unzip_epub(@file)
    EbooksHelper.convert_html_to_xhtml(unzipped_contents_path)
    new_content_href = EbooksHelper.store_epub_in_s3(unzipped_contents_path, @model, @mounted_as)
  end

  # Provide a default URL as a default if there hasn't been a file uploaded:
  # def default_url
  #   # For Rails 3.1+ asset pipeline compatibility:
  #   # asset_path("fallback/" + [version_name, "default.png"].compact.join('_'))
  #
  #   "/images/fallback/" + [version_name, "default.png"].connect.join('_')
  # end

  # Process files as they are uploaded:
  # process :resize_to_fill => [200, 200]
  #
  # def scale(width, height)
  #  # do something
  # end

  # Create different versions of your uploaded files:
  # version :tiny do
  #   process :resize_to_fill => [20, 20]
  # end

  # version :profile_size do
  #   process :resize_to_fill => [300, 300]
  # end

  # version :full_size do
  #   process :resize_to_fill => [700, 700]
  # end

  # Add a white list of extensions which are allowed to be uploaded.
  # For images ou might use something like this:
  def extension_whitelist
    %w(txt epub)
  end

  # Override the filename of the uploaded files:
  # Avoid using the model.id or version_name here, see uploader/store.rb for details.
  # def filename
  #   "something.jpg" if original_filename
  # end
  
end