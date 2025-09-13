class ProfilesController < ApplicationController
  # If you use Devise and want to protect the profile page, uncomment:
  # before_action :authenticate_user!

  def show
    # defensive: use current_user if available, otherwise nil
    @user = defined?(current_user) ? current_user : nil
  end
end