module API
  module V1
    class Schools < Grape::API
      version 'v1'
      resource :schools do
        desc 'Get school by id.'
        get ':id/classrooms' do
          if current_user.admin?
            school = School.find(params[:id])
            if school.present?
              status 200
              BaseSchoolWithClassroomsSerializer.new(school)
            else
              status 422
              "School does not exist."
            end
          else
            status 401
          end
        end
        desc 'Get classrooms without school.'
        get 'classrooms' do
          if current_user.admin?
            school = School.new(id: -1, name: "Other")
            school.classrooms = Classroom.where(school_id: nil)
            if school.present?
              status 200
              BaseSchoolWithClassroomsSerializer.new(school)
            else
              status 422
              "No classrooms"
            end
          else
            status 401
          end
        end

       
      end
    end
  end
end
