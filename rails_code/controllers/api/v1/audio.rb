module API
  module V1
    class Audio < Grape::API
      version 'v1'
      resource :audio do

        desc "Creates a new monologue"
        params do
          requires :monologue, desc: "Activity JSON", type: Hash do
            optional :activity_id, type: Integer
            optional :lesson_id, type: Integer
            requires :slug, type: String
            requires :en_text, type: String
            optional :en_audio_text, type: String
            optional :es_text, type: String
            optional :es_audio_text, type: String
          end
        end
        post "monologue" do
          if current_user.admin?
            en_audio_text = params[:monologue][:en_audio_text].present? ? params[:monologue][:en_audio_text] : params[:monologue][:en_text]
            es_text = params[:monologue][:es_text] || ""
            es_audio_text = params[:monologue][:es_audio_text].present? ? params[:monologue][:es_audio_text] : es_text

            monologue = Monologue.new(slug: params[:monologue][:slug], en_text: params[:monologue][:en_text], en_audio_text: en_audio_text, 
              es_text: es_text, es_audio_text: es_audio_text,
              activity_id: params[:monologue][:activity_id], position: params[:monologue][:position] )
            if monologue.save
              audio_service = AudioService.new
              audio_service.get_new_audio(monologue)

              status 200
              MonologueSerializer.new(monologue)
            else
              status 422
              monologue.errors
            end
          else
            status 401
          end
        end

        desc "Edit a monologue"
        params do
          requires :id, type: Integer
          requires :monologue, desc: "Activity JSON", type: Hash do
            optional :activity_id, type: Integer
            optional :lesson_id, type: Integer
            optional :position, type: Integer
            requires :id, type: Integer
            requires :slug, type: String
            requires :en_text, type: String
            requires :en_audio_text, type: String
            optional :es_text, type: String
            optional :es_audio_text, type: String
          end
        end
        put ":id/monologue" do
          if current_user.admin?
            monologue = Monologue.find(params[:id])
            en_audio_text = params[:monologue][:en_audio_text].present? ? params[:monologue][:en_audio_text] : params[:monologue][:en_text]
            es_text = params[:monologue][:es_text] || ""
            es_audio_text = params[:monologue][:es_audio_text].present? ? params[:monologue][:es_audio_text] : es_text

            if monologue.update(slug: params[:monologue][:slug], en_text: params[:monologue][:en_text], en_audio_text: params[:monologue][:en_audio_text], 
              es_text: es_text, es_audio_text: es_audio_text, position: params[:monologue][:position] )
              audio_service = AudioService.new
              audio_service.get_new_audio(monologue)

              status 200
              MonologueSerializer.new(monologue)
            else
              status 422
              monologue.errors
            end
          else
            status 401
          end
        end


        #Todo, needs fixed
        desc "Preview a new audio piece without saving"
        params do
          requires :id, type: Integer
          requires :monologue, desc: "Activity JSON", type: Hash do
            optional :activity_id, type: Integer
            optional :lesson_id, type: Integer
            optional :position, type: Integer
            requires :id, type: Integer
            requires :slug, type: String
            requires :en_text, type: String
            requires :en_audio_text, type: String
          end
        end
        put ":id/monologue" do
          if current_user.admin?
            puts "update monologue"
            puts params[:monologue]
            monologue = Monologue.find(params[:id])
            if monologue.present?
              monologue.slug = params[:monologue][:slug]
              monologue.en_text = params[:monologue][:en_text]
              monologue.en_audio_text = params[:monologue][:en_audio_text]

              audio_service = AudioService.new
              audio_service.get_new_audio(monologue)

              status 200
              MonologueSerializer.new(monologue)
            else
              status 422
              monologue.errors
            end
          else
            status 401
          end
        end

        desc "Delete a monologue"
        params do
          requires :id, type: Integer
        end
        delete ":id/monologue" do
          if current_user.admin?
            monologue = Monologue.find(params[:id])
            if monologue.destroy
              status 200
            else
              status 422
              monologue.errors
            end
          else
            status 401
          end
        end
      end
    end
  end
end