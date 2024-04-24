class AddForeignKeyConstraints < ActiveRecord::Migration[7.0]
  def change
    add_foreign_key :messages, :users, on_delete: :cascade
    add_foreign_key :profiles, :users, on_delete: :cascade
    add_foreign_key :socials, :users, on_delete: :cascade
    add_foreign_key :swipes, :users, column: :swipee_id, on_delete: :cascade
    add_foreign_key :swipes, :users, column: :swiper_id, on_delete: :cascade
    add_foreign_key :top_genres, :users, on_delete: :cascade
    add_foreign_key :top_tracks, :users, on_delete: :cascade
  end
end
