class Users::SessionsController < Devise::SessionsController
  def create
    super do |resource|
      if resource.persisted?
        flash[:notice] = "Signed in successfully."
        Rails.logger.info("User #{resource.email} logged in successfully.")
      else
        flash[:alert] = "Invalid email or password."
        Rails.logger.warn("Login attempt failed for email #{params[:user][:email]}")
      end
    end
  end
end
