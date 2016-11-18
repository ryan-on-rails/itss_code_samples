module API
  module V1
    class Responses < Grape::API
      version "v1"
      format :json

      resource :responses do
        desc "Creates a new response"
        params do
          requires :response, desc: "Response JSON"
        end
        post do
          if current_user.student_locked_lessons.pluck(:activity_id).index(current_user.current_activity_id)
            status 401
            "This activity has been locked by your teacher. Please talk to talk to them about unlocking it for you."
          else
            service = ResponseService.new
            submission = service.submit_response(params[:response], current_user)

            if submission.success?
              status 200
              ResponseFeedbackSerializer.new(submission)
            else
              OaLogger.error("User: #{current_user.id} error in response #{submission.errors.inspect}")
              status 422
              submission.errors
            end
          end
        end

        desc "Deletes responses for an activity"
        params do
          requires :activity_id, desc: "Activity ID"
        end
        post 'delete' do
          if current_user.admin?
            current_user.responses.where(activity_id: params[:activity_id]).destroy_all
          end
        end
      end
    end
  end
end
