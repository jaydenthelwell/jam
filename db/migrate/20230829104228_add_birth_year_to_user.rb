class AddBirthYearToUser < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :birth_year, :integer
  end
end
