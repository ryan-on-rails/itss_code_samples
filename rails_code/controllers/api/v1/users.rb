module API
  module V1
    class Users < Grape::API
      version 'v1'

      helpers do
        def set_activity(user, activity_id)
          activity = Activity.find_by(id: activity_id)
          if activity
            user.update(current_activity: activity)
            status 200
          else
            status 422
          end
        end

        def update_user(user, params)
          if user.update(params)
            status 200
            user
          else
            status 422
            user.errors
          end
        end
      end

      resource :users do
        desc "Update the current user."
        params do
          optional :watched_intro
        end
        put "current" do
          if current_user.update(declared(params))
            status 200
          else
            current_user.errors
            status 422
          end
        end

        desc "Update student data"
        params do
          requires :student_id, type: Integer, desc: "Student ID"
          optional :current_activity_id, type: Integer, desc: "New Activity ID"
        end
        put ':student_id' do
          user = User.find_by(id: params['student_id'])
          if user.nil?
            status 422
            return "No User #{params['student_id']}"
          end

          OaLogger.info("User: #{current_user.id} set student's (id: #{user.id}) current_activity to #{params[:current_activity_id]}")
          if current_user.admin?
            update_user(user, declared(params, include_missing: false))
          elsif current_user.teacher? && current_user.classroom_id == user.classroom_id
            update_user(user, declared(params, include_missing: false))
          else
            unauthorized!
          end
        end

        # NOTE: For admin use ONLY
        desc "Update the current user's current activity."
        params do
          requires :activity_id, desc: "Activity ID"
        end
        post "current_activity" do
          if current_user.admin?
            set_activity(current_user, params[:activity_id])
          else
            unauthorized!
          end
        end

        # NOTE: For admin use ONLY
        desc "Update the current user's current activity."
        params do
          requires :id, desc: "User ID"
          requires :classroom_id, desc: "Classroom ID"
        end
        put ":id/set_classroom" do
          if current_user.admin?
            user = params[:id] == current_user.id ? current_user : User.find(params[:id])
            # classroom = Classroom.find(params[:classroom_id])
            # puts "classroom"
            # puts classroom
            if user.update(classroom_id: params[:classroom_id])
              status 200
              UserSerializer.new(user)
            else
              status 422
              user.errors
            end
          else
            unauthorized!
          end
        end

        # NOTE: For admin use ONLY
        desc "Update the current user's lesson."
        params do
          requires :lesson_id, desc: "Lesson ID"
        end
        post "current_lesson" do
          if current_user.admin?
            lesson = Lesson.find(params[:lesson_id])

            if lesson
              current_user.update(current_activity: lesson.activities.first)
              status 200
            else
              status 422
            end
          else
            unauthorized!
          end
        end
      end
    end
  end
end
