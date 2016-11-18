module API
  module V1
    class Pages < Grape::API
      version "v1"
      resource :pages do

        desc "Get a page"
        get ":id" do
          page = params[:id].present? ? Page.find_by(id: params[:id]) : current_user.current_activity.page
          if page.present?
            status 200
            PageSerializer.new(page, scope: current_user)
          else
            status 422
          end
        end

        desc "Get current page"
        get do
          if page = current_user.current_activity.page
            status 200
            PageSerializer.new(page, scope: current_user)
          else
            status 422
          end
        end

        desc "Creates a new page"
        params do
          requires :page, desc: "Page JSON", type: Hash do
            requires :lesson_id, desc: "Id of parent lesson"
            optional :next_page_id, type: Integer
            optional :position, type: Integer
            optional :activities, type: Array do
              optional :activity, type: Hash do
                optional :instructions, desc: "Activity Instructions", type: String
                requires :type, desc: "Activity type", type: String
                requires :category, desc: "Activity category", type: String
              end
            end
            optional :content_elements, type: Array do
              optional :content_element, type: Hash do
                requires :type, desc: "CE type", type: String
                requires :category, desc: "CE category", type: String
              end
            end
          end
        end
        post do
          if current_user.admin?
            activities = params[:page].delete("activities")
            content_elements = params[:page].delete("content_elements")

            page = Page.new(params[:page])
            lesson = Lesson.find(page.lesson_id)

            if page.save
              activities.each { |a| save_activity(a, page.id) }
              content_elements.each { |ce| new_ce = save_content_element(ce, page.id) }

              lesson.pages << page if lesson
              status 200
              LessonSerializer.new(lesson)
            else
              status 422
              page.errors
            end
          else
            status 401
          end
        end


      	desc "Edit a Page"
        params do
          requires :id, desc: "Id of page"
          requires :page, desc: "Page JSON", type: Hash do
            requires :id, type: Integer
            optional :next_page_id, type: Integer
            optional :position, type: Integer
            optional :activities, type: Array do
              optional :activity, type: Hash do
                optional :instructions, desc: "Activity Instructions", type: String
                requires :type, desc: "Activity type", type: String
                requires :category, desc: "Activity category", type: Float
                optional :active, desc: "Activity active status", type: String
              end
            end
            optional :content_elements, type: Array do
              optional :content_element, type: Hash do
                optional :instructions, desc: "Activity Instructions", type: String
                requires :type, desc: "Activity type", type: String
                requires :category, desc: "Activity category", type: Float
                optional :active, desc: "Activity active status", type: String
              end
            end
          end
        end
        put ":id" do
          if current_user.admin?
          	activities = params[:page].delete("activities")
          	content_elements = params[:page].delete("content_elements")
          	params[:page].delete("next_page_id")
            page = Page.find(params[:id])

            if page.update(params[:page])
              old_ids = page.activities.pluck(:id)
              new_ids = activities.map {|activity| save_activity(activity, page.id)}
              delete_ids = old_ids - new_ids
              Activity.where(id: delete_ids).destroy_all


              old_ids = page.content_elements.pluck(:id)
              new_ids = content_elements.map {|content_element| save_content_element(content_element, page.id)}
              delete_ids = old_ids - new_ids
              ContentElement.where(id: delete_ids).destroy_all

              status 200
              AdminPageSerializer.new(page)
            else
              status 422
              page.errors
            end
          else
            status 401
          end
        end

        desc "Delete a page"
        params do
          requires :id, desc: "page ID"
        end
        delete ":id" do
          if current_user.admin?
            page = Page.find(params[:id])
            if page.destroy
              status 200
            else
              status 422
              page.errors
            end
          else
            status 401
          end
        end
      end
    end
  end
end
