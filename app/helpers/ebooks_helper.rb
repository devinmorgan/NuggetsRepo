module EbooksHelper

  require 'rubygems'
  require 'fog-aws'

  # dir_of_path returns the directory of the object located
  # at path. Returns the empty string if the object in the
  # root directory
  def self.dir_of_path(path)
    return path[0..path.rindex('/')] unless path.rindex('/') == nil
    ""
  end

  # Unzips the epub file, extracts its contents, stores the files
  # in the same directory as the .epub file. Deletes the .epub file
  # once the extraction process is complete
  def self.unzip_epub(epub_file)
    # determine the path that the epub was stored
    unzipped_content_dir_path = dir_of_path(epub_file.path)

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
  # to s3 with a similar path and subsequently deletes the
  # local content. It updates the content_href for the
  # the cooresponding book in the database
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
          # "#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}#
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


end
