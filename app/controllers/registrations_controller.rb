class RegistrationsController < Devise::RegistrationsController
  protected

  def after_sign_up_path_for(resource_or_scope)
    Profile.create(user: current_user)
    '/top_genres/new'
  end

  def sign_up_params
    params.require(:user).permit(:name, :d_o_b, :location, :gender, :on_repeat, :all_time_favorite, :go_to_karaoke, :description, photos: [])
  end

  def create
    @user = User.new(user_params)
    if @user.save
      # Handle successful user creation (e.g., redirect to a confirmation page)
    else
      # Handle failed user creation (e.g., render the registration form with errors)
      render :new
    end
  end
end
