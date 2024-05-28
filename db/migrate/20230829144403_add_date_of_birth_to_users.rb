class AddDateOfBirthToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :_birth, :date
  end
end
