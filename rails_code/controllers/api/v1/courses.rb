module API
  module V1
    class Courses < Grape::API
      version "v1"
      resource :courses do
        desc "Get a list of courses"
        get do
          status 200
          Course.all
        end

        
        desc "Creates a new course"
        params do
          requires :course, desc: "Course JSON", type: Hash do
            requires :name, type: String
            optional :description, type: String
          end
        end
        post do
          #description = params[:course].delete("description") 
          if current_user.admin?
            course = Course.new(params[:course])
            if course.save
              status 200
              BaseCourseSerializer.new(course)
            else
              status 422
              course.errors
            end
          else
            status 401
          end
        end

        desc "Edit a course"
        params do
          requires :id, desc: "Course ID", type: Integer
          requires :course, desc: "Course JSON", type: Hash do
            requires :id, desc: "Course ID", type: Integer
            requires :name, type: String
            optional :description, type: String
          end
        end
        put ":id" do
          #params[:course].delete("description") 
          params[:course].delete("lessons") 

          if current_user.admin?
            course = Course.find(params[:id])
            if course.update(params[:course])
              status 200
              BaseCourseSerializer.new(course)
            else
              status 422
              course.errors
            end
          else
            status 401
          end
        end

        desc "Delete a course"
        params do
          requires :id, desc: "Course ID"
        end
        delete ":id" do
          if current_user.admin?
            course = Course.find(params[:id])
            if course.destroy
              status 200
            else
              status 422
              course.errors
            end
          else
            status 401
          end
        end

      end
    end
  end
end
