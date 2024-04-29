class AddForeignKeyConstraints < ActiveRecord::Migration[7.0]
  def change
    add_foreign_key :messages, :users, on_delete: :cascade unless foreign_key_exists?(:messages, :users)
    add_foreign_key :profiles, :users, on_delete: :cascade unless foreign_key_exists?(:profiles, :users)
    add_foreign_key :socials, :users, on_delete: :cascade unless foreign_key_exists?(:socials, :users)
    add_foreign_key :swipes, :users, column: :swipee_id, on_delete: :cascade unless foreign_key_exists?(:swipes, :users, column: :swipee_id)
    add_foreign_key :swipes, :users, column: :swiper_id, on_delete: :cascade unless foreign_key_exists?(:swipes, :users, column: :swiper_id)
    add_foreign_key :top_genres, :users, on_delete: :cascade unless foreign_key_exists?(:top_genres, :users)
    add_foreign_key :top_tracks, :users, on_delete: :cascade unless foreign_key_exists?(:top_tracks, :users)
  end
end
