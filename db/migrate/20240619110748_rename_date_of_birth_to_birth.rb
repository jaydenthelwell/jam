class RenameDateOfBirthToBirth < ActiveRecord::Migration[7.0]
  def change
    rename_column :users, :date_of_birth, :_birth
  end
end
