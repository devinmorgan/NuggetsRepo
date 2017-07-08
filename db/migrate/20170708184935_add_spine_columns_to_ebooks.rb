class AddSpineColumnsToEbooks < ActiveRecord::Migration[5.1]
  def change
    add_column :ebooks, :spine_urls, :text
    add_column :ebooks, :spine_index, :integer
  end
end
