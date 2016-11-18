require 'grape-swagger'

module API
  # mounts the base API
  class Base < Grape::API
    default_format :json
    helpers Devise::Controllers::SignInOut
    helpers ActivityHelper    
    helpers ContentElementHelper

    helpers do
      def warden
        env['warden']
      end

      def current_user
        warden.user || @user
      end

      def logger
        Rails.logger
      end

      def unauthorized!
        status 403
      end
    end

    mount API::V1::Base

    if Rails.env.development?
      add_swagger_documentation base_path: '/api', hide_documentation_path: true, api_version: 'v1'
    end
  end
end