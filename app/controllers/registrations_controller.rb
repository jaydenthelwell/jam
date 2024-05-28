class RegistrationsController < Devise::RegistrationsController
  protected

  def after_sign_up_path_for(resource_or_scope)
    Profile.create(user: current_user)
    '/top_genres/new'
  end

  def sign_up_params
    params.require(:user).permit(:name, :date_of_birth, :location, :email, :password, :password_confirmation)
  end
end
