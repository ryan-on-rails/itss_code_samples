module API
  module V1
    class Activities < Grape::API
      version 'v1'
      resource :activities do
        desc "Creates a new activity"
        params do
          requires :activity, desc: "Activity JSON", type: Hash do
            requires :type, type: String
            requires :category, type: String
            requires :instructions, type: String
            requires :position, type: String
            requires :page_id, type: String
          end
        end
        post do
          description = params[:activity].delete("description") 
          if current_user.admin?
            activity = Activity.new(params[:activity])
            if activity.save
              status 200
              BaseActivitySerializer.new(activity)
            else
              status 422
              activity.errors
            end
          else
            status 401
          end
        end
        desc "Toggle Lock on an activity for a list of students"
        params do
          requires :student_ids, desc: "Students Array", type: Array
        end
        put ":id/toggle_lock" do
          if current_user.admin_or_teacher?
            student_ids = params[:student_ids]
            students = {}
            if activity = Activity.find(params[:id])
              student_ids.each do |student_id|
                student = User.find(student_id)
                if student.student_locked_lessons.where(activity_id: activity.id).count > 0
                  student.student_locked_lessons.where(activity_id: activity.id).destroy_all
                else
                  student.student_locked_lessons.create(activity_id: activity.id)
                end
                students[student.id] = student.student_locked_lessons.pluck(:activity_id)
              end 
              status 200
              students
            else
              status 422
              activity.errors
            end
          else
            status 401
          end
        end
      end
    end
  end
end