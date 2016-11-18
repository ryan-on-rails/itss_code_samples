module API
  module V1
    class Articles < Grape::API
      rescue_from Rack::Timeout::RequestTimeoutError, Rack::Timeout::RequestExpiryError, with: :handle_timeout
      version "v1"
      resource :articles do



        desc 'Get lesson Data.'
        params do
          requires :id, desc: 'Article Id'
        end
        get ':id' do
          if article = Article.find(params[:id])
            status 200
            ArticleSerializer.new(article)
          else
            status 422
          end
        end
        desc "Creates a new article"
        params do
          requires :article, desc: "article JSON", type: Hash do
            optional :en_title, type: String
            optional :en_body, type: String
            optional :en_main_idea, type: String
            optional :slug, type: String
            optional :en_recall, type: String
            requires :structure_id, type: Integer
          end
        end
        post do
          if current_user.admin?
            begin
              params[:article].delete("is_hybrid")
              article = Article.new(params[:article])
              article.update_all_sections()
              status 200
              ArticleSerializer.new(article.reload)
            rescue => error
              status 422
              error
            end
          else
            status 401
          end
        end

        desc "Edit a article"
        params do
          requires :article, desc: "article JSON", type: Hash do
            requires :id, type: Integer
            optional :en_title, type: String
            optional :en_body, type: String
            optional :en_main_idea, type: String
            optional :slug, type: String
            optional :en_recall, type: String
            requires :structure_id, type: Integer
          end
        end
        put ":id" do
          if current_user.admin?
            begin
              params_article = params[:article].except(:is_hybrid, :structure_name, :en_title_paragraphs, :en_body_paragraphs,
                 :en_main_idea_paragraphs, :en_recall_paragraphs, :es_title_paragraphs, :es_body_paragraphs, :es_main_idea_paragraphs, :es_recall_paragraphs)

              article = Article.find(params_article[:id])
              article.update_all_sections(params_article)
              article.en_title = params_article[:en_title] if params_article[:en_title].present?
              article.structure_id = params_article[:structure_id] if params_article[:structure_id].present?
              article.save if article.changed?
              status 200
              ArticleSerializer.new(article)
            rescue Rack::Timeout::RequestTimeoutError => e
              status 408
              "Timeout Error"
            rescue Timeout::Error => e
              status 408
              "Timeout Error"
            rescue => error
              OaLogger.error(error)
              status 422
              error
            end
          else
            status 401
          end
        end

        desc "Edit a sentence's synonym"
        params do
          requires :id, type: Integer, desc: "Article id"
          requires :base_sentence_id, type: Integer, desc: "Origin sentence id"
          optional :sentence_synonym_id, type: Integer
          optional :synonym_sentence_id, type: Integer
          optional :sentence, type: String
          optional :image, type: Rack::Multipart::UploadedFile
          optional :delete_image, type: Boolean
        end
        put ":id/sentence_synonym" do
          if current_user.admin?
            begin
              #find base sentence
              # sentence_params = JSON.parse(params[:sentence])
              base_sentence = Sentence.includes(sentence_words: [:word]).find(params[:base_sentence_id])
              language_abbv = base_sentence.words.first.language.abbv

              #find sentence_synonym
              if params[:sentence_synonym_id].present?
                sentence_synonym = SentenceSynonym.find_by(id: params[:sentence_synonym_id])
              end

              # if sentence_synonym doesnt exist, create it
              # else delete old synonym sentence, create a new one and update association
              if sentence_synonym.blank?
                if params[:sentence].blank? && params[:image].present?
                  image_text = language_abbv == "es" ? "ver imagen" : "see image"
                  sentence_synonym = base_sentence.create_sentence_synonym(image_text, language_abbv)
                else
                  sentence_synonym = base_sentence.create_sentence_synonym(params[:sentence], language_abbv)
                end
              elsif sentence_synonym.synonym_sentence.to_s != params[:sentence]
                old_sentence = sentence_synonym.synonym_sentence
                base_sentence.update_sentence_synonym(params[:sentence], language_abbv, sentence_synonym.id)
                old_sentence.destroy
              end
              if params[:delete_image].present? && params[:delete_image] == true
                sentence_synonym.image = nil
                sentence_synonym.save
              elsif params[:image].present?
                sentence_synonym.image = ActionDispatch::Http::UploadedFile.new(params[:image])
                sentence_synonym.save
              end

              status 200
              SentenceSerializer.new(base_sentence)
              #ArticleSerializer.new(Article.includes(article_paragraphs: [paragraph: [paragraph_sentences:[sentence:[sentence_words:[word: [translations:[:target_word]]]]]]]).find(params[:id]))
            rescue => error
              puts error
              status 422
              error
            end
          else
            status 401
          end
        end
        desc "Edit a word's translations"
        params do
          requires :id, type: Integer, desc: "Article id"
          requires :sentence_id, type: Integer, desc: "sententce id"
          requires :word, desc: "word record", type: Hash do
            requires :id, type: Integer, desc: "word id"
            optional :default_translation_id, type: Integer, desc: "default translation id"
            optional :content, type: String, desc: "word content"
            optional :language_abbv, type: String, desc: "word language_abbv"
            optional :translations, type: Array do
              optional :translation_word, type: Hash do
                optional :id, type: Integer, desc: "word id"
                optional :content, type: String, desc: "word content"
                optional :language_abbv, type: String, desc: "word language_abbv"
              end
            end
          end
        end
        put ":id/word_translations" do
          if current_user.admin?
            word = Word.find_by(id: params[:word][:id])
            sentence_word = SentenceWord.find_by(sentence_id: params[:sentence_id], word_id: word.id)
            new_default_id = nil
            reset_default_id = false
            target_language_abbv = word.language.abbv == "en" ? "es" : "en"
            old_ids = word.get_translations(target_language_abbv).map{|t| t.id}
            new_ids = []
            translation_words = params[:word][:translations]
            if word.present?
              # Start edit/create translations
              translation_words.each do |tw|
                translation_word = nil
                tw_content = tw[:content].strip

                #if word has id, it already exists, we need to make sure it wasnt updated
                if tw[:id].present? && word.translations.where(target_word_id: tw[:id]).present?
                  old_word = Word.find_by(id: tw[:id])
                  if tw_content != old_word.content
                    word.translations.where(target_word_id: tw[:id]).first.destroy

                    #if we are setting default to be a word we are going to update as well, set flag
                    reset_default_id = true if params[:word][:default_translation_id] == tw[:id]
                  end
                end

                if(target_language_abbv == "es")
                  translation_word = word.create_spanish_translation(tw_content).target_word
                else
                  translation_word = word.create_english_translation(tw_content).target_word
                end

                #if we are setting default to be a word we are going to update as well, get new word id to set later
                new_default_id = translation_word.id if reset_default_id
                reset_default_id = false

                new_ids.push(translation_word.id)
              end
              delete_ids = old_ids - new_ids
              delete_ids.each do |target_id|
                del_obj = word.translations.where(target_word_id: target_id).first
                del_obj.destroy if del_obj.present?
              end
              #Start Default translation
              translation_ids = target_language_abbv == "es" ? word.get_spanish_translations().map{|w| w.id} : word.get_english_translations().map{|w| w.id}
              if translation_ids.count > 0
                if sentence_word.present?
                  default_translation_id = sentence_word.default_translation_id != nil ? sentence_word.default_translation_id : translation_ids.first

                  if params[:word][:default_translation_id].present? && translation_ids.include?(params[:word][:default_translation_id])
                    default_translation_id = params[:word][:default_translation_id]
                  end

                  #if we are setting default to be a word we are going to update as well, use new id instead
                  default_translation_id = new_default_id if new_default_id.present?

                  sentence_word.update(default_translation_id: default_translation_id) if sentence_word.default_translation_id != default_translation_id
                end
              else
                default_translation_id = nil
              end


              status 200
              WordSerializer.new(word.reload, context: {default_translation_id: (sentence_word.default_translation_id || nil)})
            else
              status 422
            end
          else
            status 401
          end
        end
        desc "Toggle a common abbv"
        params do
          requires :id, type: Integer, desc: "Article id"
          requires :word_id, type: Integer, desc: "Word id"
          requires :sentence_id, type: Integer, desc: "Word id"
        end
        put ":id/common_abbv" do
          if current_user.admin?
            #Get target word and sentence
            word = Word.find_or_initialize_by(id: params[:word_id])

            article_paragraph = ArticleParagraph.find_by(article_id: params[:id], paragraph_id: Sentence.find_by(id: params[:sentence_id]).paragraph.id)
            paragraph_ids = ArticleParagraph.where(article_id: params[:id], article_paragraph_intention_id: article_paragraph.article_paragraph_intention_id).pluck(:paragraph_id)
            paragraphs = Paragraph.where(id: paragraph_ids)
            action = "add"
            if word.is_well_known_abbreviation?
              word.remove_well_known_abbreviation
              action = "remove"
            else
              word.make_well_known_abbreviation
            end

            paragraphs.each_with_index do |paragraph, paragraph_index|
              paragraph.sentences.each_with_index do |first_sentence, sentence_index|
                word_index = first_sentence.sentence_words.where(word_id: word.id).pluck(:position).first
                next unless word_index.present?
                #find last word. if last word is punctuation, get the word before it
                if [".", "!", "?"].include?(first_sentence.words.last.content)
                  last_sentence_word = first_sentence.sentence_words[first_sentence.sentence_words.count - 2]
                  word_index += 1
                else
                  last_sentence_word = first_sentence.sentence_words.last
                end
                paragraph = first_sentence.paragraph

                #if word is already an abbreviation, we remove the abbv status from it
                #and then we need to split the sentence into 2 sentences
                if action == "remove"
                  #move sentences up to make room for new sentence

                  if last_sentence_word.word != word
                    paragraph.paragraph_sentences.each_with_index do|ps,i|
                      ps.update(position: ps.position+1) if ps.position > first_sentence.paragraph_sentence.position
                    end
                    #createing new sentence and moving words after target word index
                    second_sentence = Sentence.create()
                    paragraph.paragraph_sentences.create(sentence_id: second_sentence.id, position: first_sentence.paragraph_sentence.position+1)
                    first_sentence.sentence_words.each_with_index do |sw, i|
                      sw.update(sentence_id: second_sentence.id, position: second_sentence.words.count) if sw.position > word_index
                    end
                  end
                else
                  #otherwise we need to add the abbv status to the word
                  #and then we need to combine the sentences into 1 sentence if the word was at the end of the sentence
                  if last_sentence_word.word == word
                    second_sentence_paragraph_sentence = paragraph.paragraph_sentences.find_by(position: first_sentence.paragraph_sentence.position+1)
                    if second_sentence_paragraph_sentence.present?
                      #moving words into the first sentence after target word.
                      second_sentence = second_sentence_paragraph_sentence.sentence
                      second_sentence.sentence_words.each_with_index do |sw, i|
                        sw.update(sentence_id: first_sentence.id, position: first_sentence.words.count)
                      end
                      #destroy second sentence (should be empty now)
                      second_sentence.destroy
                      #reset the sentence positions
                      paragraph.paragraph_sentences.each_with_index {|ps, i| ps.update(position: i)}
                    end
                  end
                end
              end
            end
            article = Article.find_by(id: params[:id])
            status 200
            ArticleSerializer.new(article) if article.present?
          else
            status 401
          end
        end
      end

      protected
      def handle_timeout
        status 500
      end
    end
  end
end
