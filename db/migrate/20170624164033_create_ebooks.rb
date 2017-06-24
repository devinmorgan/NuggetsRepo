class CreateEbooks < ActiveRecord::Migration[5.1]
  def change
    create_table :ebooks do |t|
      t.string :title
      t.string :content_href

      t.timestamps
    end
  end
end
