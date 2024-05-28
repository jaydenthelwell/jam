class Users::RegistrationsController < Devise::RegistrationsController
  def create
    @user = User.new(user_params)
    if @user.save
      # Handle successful user creation (e.g., redirect to a confirmation page)
    else
      # Handle failed user creation (e.g., render the registration form with errors)
      render :new
    end
  end

  def new
    @user = User.new(gender: "Male") # Set a default gender or retrieve it from somewhere else
  end

  private

  def sign_up_params
    params.require(:user).permit(:email, :password, :password_confirmation, :name, :d_o_b, :location, :gender, :on_repeat, :all_time_favorite, :go_to_karaoke, :description, photos: [])
  end

end
