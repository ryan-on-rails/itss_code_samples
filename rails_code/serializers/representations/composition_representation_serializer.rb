class CompositionRepresentationSerializer < RepresentationSerializer
  attributes :answer

  def answer
    if object.is_a?(Response) && object.is_passing_score?
      object.answers.map { |a|
        { content: a.content, question: a.question.content }
      }
    else
      case activity.category
      when "Main Idea" then [{ content: activity.article.get_paragraph_collection(ArticleParagraphIntention.purposes['en_main_idea']).to_s }]
      when "Writing"
        if activity.article.present? && activity.article.en_main_idea.present?
          [{ content: activity.article.get_paragraph_collection(ArticleParagraphIntention.purposes['en_main_idea']).to_s }]
        else
          string = ""
          activity.questions.each do |question|
            string += "Idea Words: #{question.main_idea_words.map{|w| w.content}.join(', ')} \n" if question.main_idea_words.present?
            string += "Signaling Words: #{question.signaling_words.map{|w| w.content}.join(', ')} \n" if question.signaling_words.present?
            string += "Detail Words: #{question.detail_words.map{|w| w.content}.join(', ')} \n" if question.detail_words.present?
          end
          [{ content: string }]
        end
      when "Recall" then [{ content: activity.article.en_recall }]
      else
        raise NotImplementedError,
          "Cannot find answer for category: #{activity.category}"
      end
    end
  end
end
