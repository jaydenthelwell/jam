class Users::RegistrationsController < Devise::RegistrationsController

  private

  def after_sign_up_path_for(resource_or_scope)
    Profile.create(user: current_user)
    '/top_genres/new'
  end

  def sign_up_params
    params.require(:user).permit(:email, :password, :password_confirmation, :name, :date_of_birth, :location, :gender, :on_repeat, :all_time_favorite, :go_to_karaoke, :description, photos: [])
  end

end
