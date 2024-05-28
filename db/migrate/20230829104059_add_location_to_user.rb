class AddLocationToUsers < ActiveRecord::Migration[6.0]
  def change
    unless column_exists?(:users, :location)
      add_column :users, :location, :string
    end
  end
end
