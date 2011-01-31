class CreatePosts < ActiveRecord::Migration
  def self.up
    create_table :posts do |t|
      t.date :created_at
      t.date :updated_at
      t.date :published_at
      t.boolean :published
      t.text :title
      t.text :content

      t.timestamps
    end
  end

  def self.down
    drop_table :posts
  end
end
