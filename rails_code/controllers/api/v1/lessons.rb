module API
  module V1
    class Lessons < Grape::API
      version 'v1'
      format :json
      resource :lessons do
        desc 'Get the current student\'s lesson.'
        get 'current' do
          if current_user.current_activity.page.lesson.published == false
            current_lesson = current_user.current_activity.page.lesson
            _lesson = current_user.current_activity.page.lesson
            while(_lesson.published == false)
              _lesson = _lesson.default_next_lesson
            end
            #lesson = Lesson.where(["number > ? and published = ?", current_lesson.number, true]).first
            current_user.update(current_activity: _lesson.pages.first.activities.first)
          end

          status 200
          ClientStateSerializer.new(current_user)
        end

        desc 'Get lesson Data.'
        params do
          requires :lesson_id, desc: 'Lesson Id'
        end
        post 'data' do
          if lesson = Lesson.find(params[:lesson_id])
            status 200
            AdminLessonSerializer.new(lesson)
          else
            status 422
          end
        end

        desc 'Creates a new lesson'
        params do
          requires :lesson, desc: 'Lesson JSON', type: Hash do
            requires :title, type: String
            requires :number, type: Float
            requires :structure_id, type: String
            optional :description, type: String
            optional :published, type: Boolean
            optional :default_pass_feedback_id, type: Integer
            optional :default_fail_feedback_id, type: Integer
            optional :default_next_lesson_id, type: Integer
            optional :remedial_next_lesson_id, type: Integer
            optional :advanced_next_lesson_id, type: Integer
          end
          requires :course_id, desc: 'Id of parent course'
        end
        post do
          if current_user.admin?
            lesson = Lesson.new(params[:lesson])
            lesson.description = lesson.description.present? ? lesson.description : lesson.title
            course = nil


            if Course.exists?(params[:course_id])
              course = Course.find(params[:course_id])
            end

            if lesson.save
              course.lessons << lesson if course
              status 200
              BaseLessonSerializer.new(lesson)
            else
              status 422
              lesson.errors
            end
          else
            status 401
          end
        end

        desc 'Edit a lesson'
        params do
          requires :lesson, desc: 'Lesson JSON', type: Hash do
            requires :id, desc: 'Lesson ID', type: Integer
            requires :title, type: String
            requires :structure_id, type: Integer
            requires :number, type: Float
            optional :description, type: String
            optional :published, type: Boolean
            optional :default_pass_feedback_id, type: Integer
            optional :default_fail_feedback_id, type: Integer
            optional :default_next_lesson_id, type: Integer
            optional :remedial_next_lesson_id, type: Integer
            optional :advanced_next_lesson_id, type: Integer
          end
        end
        put ':id' do

          if current_user.admin?
            lesson = Lesson.find(params[:lesson][:id])
            if lesson.update(params[:lesson])
              status 200
              LessonSerializer.new(lesson)
            else
              status 422
              lesson.errors
            end
          else
            status 401
          end
        end

        desc "Delete a lesson"
        params do
          requires :id, desc: "Lesson ID"
          requires :course_id, desc: "Id of parent course"
        end
        delete ":id" do
          if current_user.admin?
            lesson = Lesson.find(params[:id])
            if lesson.destroy
              course = Course.find(params[:course_id])
              status 200
              BaseCourseSerializer.new(course, scope: current_user)
            else
              status 422
              lesson.errors
            end
          else
            status 401
          end
        end

        params do
          requires :id, type: Integer, desc: 'Classroom ID'
          requires :file, type: Rack::Multipart::UploadedFile
        end
        route_param :id do
          desc 'Upload a file'
          post '/file' do
            if current_user.admin?
              la = LessonAttachment.new(lesson_id: params[:id])
              la.attachment = ActionDispatch::Http::UploadedFile.new(params[:file])
              if la.save
                status 200
                LessonAttachmentSerializer.new(la)
              else
                status 422
                la.errors
              end
            else
              status 401
            end
          end
          desc 'Delete a file'
          delete '/file' do
            if current_user.admin?
              la = LessonAttachment.find(params[:id])
              if la.destroy
                status 200
              else
                status 422
                la.errors
              end
            else
              status 401
            end
          end
        end

        desc 'Return all lesssons with resources attached'
        get '/all_resources' do
          lessons = Lesson.joins(:lesson_attachments).includes(:lesson_attachments)
          LessonResourcesSerializer.new(lessons)
        end

      end
    end
  end
end
