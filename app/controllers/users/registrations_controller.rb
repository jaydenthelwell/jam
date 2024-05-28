class Users::RegistrationsController < Devise::RegistrationsController
  private

  def sign_up_params
    params.require(:user).permit(:email, :password, :password_confirmation, :name, :d_o_b, :location, :gender, :on_repeat, :all_time_favorite, :go_to_karaoke, :description, photos: [])
  end
end
