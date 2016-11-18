module API
  module V1
    class Classroom < Grape::API
      version "v1"
      format :json

      helpers do
        def teacher_or_admin(user)
          if user.admin? || user.teacher?
            true
          else
            status 401
            false
          end
        end
      end

      resource :classroom do
        desc 'Return info about the classroom'
        params do
          requires :classroom_id, type: Integer, desc: 'Classroom ID'
        end
        route_param :classroom_id do
          get 'student_response_data' do
            if teacher_or_admin(current_user)
              ##could cause speed issues. may need moved
              ImportFromAdminService.new.import_students_for_classroom(current_user.classroom_id) 
              ClassroomStudentResponseDataSerializer.new(params[:classroom_id])
            else
              "Unauthorized"
            end
          end

          get 'activities' do
            if teacher_or_admin(current_user)
              #Structure.all.map {|struct| ClassroomStructureSerializer.new(struct)}
              ClassroomActivitiesSerializer.new(params[:classroom_id])
            else
              "Unauthorized"
            end
          end

          get 'roster' do
            if teacher_or_admin(current_user)
              Student.all.where(classroom_id: params[:classroom_id]).order(:last_name).map do|student|
                BaseStudentSerializer.new(student)
              end
            else
              "Unauthorized"
            end
          end

          get 'high_score_report' do
            if teacher_or_admin(current_user)
              ClassroomHighScoreReportSerializer.new(params[:classroom_id])
            else
              "Unauthorized"
            end
          end

          get 'recent_activity_report' do
            if teacher_or_admin(current_user)
              ClassroomRecentActivitySerializer.new(params[:classroom_id])
            else
              "Unauthorized"
            end
          end

          get 'gaming_report' do
            if teacher_or_admin(current_user)
              ClassroomGamingReportSerializer.new(params[:classroom_id])
            else
              "Unauthorized"
            end
          end

          get 'main_idea_report' do
            if teacher_or_admin(current_user)
              ClassroomMainIdeaReportSerializer.new(params[:classroom_id])
            else
              "Unauthorized"
            end
          end
        end
      end
    end
  end
end
