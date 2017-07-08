module EbooksHelper

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

end