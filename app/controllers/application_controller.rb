class ApplicationController < ActionController::Base
  protect_from_forgery

  def index
    render :layout => 'application', :nothing => true
  end
end
