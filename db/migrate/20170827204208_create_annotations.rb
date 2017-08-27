class CreateAnnotations < ActiveRecord::Migration[5.1]
  def change
    create_table :annotations do |t|
      t.integer :ebook_id
      t.integer :section_id
      t.string :highlight_ranges
      t.text :categories
      t.text :remark

      t.timestamps
    end
  end
end
