class AddHighlightedTextToAnnotations < ActiveRecord::Migration[5.1]
  def change
    add_column :annotations, :highlighted_text, :text
  end
end
