class EnsureLocationAndGenderInUsers < ActiveRecord::Migration[7.0]
  def change
    # Add location column if it does not exist
    unless column_exists?(:users, :location)
      add_column :users, :location, :string
    end

    # Add gender column if it does not exist
    unless column_exists?(:users, :gender)
      add_column :users, :gender, :string
    end
  end
end
