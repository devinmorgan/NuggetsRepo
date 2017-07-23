class RenameSpineUrlsToSpinePaths < ActiveRecord::Migration[5.1]
  def change
    rename_column :ebooks, :spine_urls, :spine_paths
  end
end
