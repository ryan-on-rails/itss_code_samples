module API
  module V1
    class Students < Grape::API
      version 'v1'
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

      resource :students do
        desc 'Return info about a student'
        route_param :student_id do
          params do
            requires :student_id, type: Integer, desc: 'Student ID'
            requires :activity_id, type: Integer, desc: 'Activity ID'
          end
          get 'response_data' do
            if teacher_or_admin(current_user)
              StudentActivityResponseSummary.new(params[:student_id], params[:activity_id]).summarize
            else
              "Unauthorized"
            end
          end
        end

        desc 'Set a Student\'s language'
        params do
          requires :student_ids, type: Array
          requires :language_abbv, type: String, desc: 'language abbv'
        end
        put "set_language" do
          begin
            english = Language.find_by(abbv: "en")
            spanish = Language.find_by(abbv: "es")
            students = Student.where(id: params[:student_ids])
            updated_students = students.map do |student|
              case params[:language_abbv]
                when "en"
                  student.languages << english unless student.languages.include?(english)
                  student.languages.delete(spanish)
                when "es"
                  student.languages << spanish unless student.languages.include?(spanish)
                  student.languages.delete(english)
                when "hybrid"
                  student.languages << spanish unless student.languages.include?(spanish)
                  student.languages << english unless student.languages.include?(english)
              end
              OaLogger.info("User: #{current_user.id} set student's (id: #{user.id}) language to #{params[:language_abbv]}")
              StudentResponseDataSerializer.new(student)
            end
            status 200
            updated_students

          rescue => error
            OaLogger.error(error)
            status 422
            error
          end
        end

        desc 'Delete Student'
        params do
          requires :student_username, type: String, desc: 'Student Username'
          requires :app_exchange_key, type: String, desc: 'app exchange key'
        end
        delete "admin_delete" do
          if params[:app_exchange_key].present? && params[:app_exchange_key] == APP_EXCHANGE_KEY
            begin
              if Student.find_by(username: params[:student_username]).destroy
                status 200
              end
            rescue => error
              status 422
            end
          else
            render :json => { :error => "app exchange key not present" }, :status => 401
          end
        end

        desc 'Update Student'
        params do
          requires :student, type: Hash, desc: 'Student'
          requires :app_exchange_key, type: String, desc: 'app exchange key'
        end
        post "admin_update" do
          if params[:app_exchange_key].present? && params[:app_exchange_key] == APP_EXCHANGE_KEY
            begin
              student = Student.find_or_initialize_by(username: params[:student][:username])
              student.cas_extra_attributes=(params[:student])
              if student.save
                status 200
              end
            rescue => error
              status 422
            end
          else
            render :json => { :error => "app exchange key not present" }, :status => 401
          end
        end
      end
    end
  end
end
