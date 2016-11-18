class TreeRepresentationSerializer < RepresentationSerializer
  attributes :answer

  def answer
    if object.is_a?(Response) && object.is_passing_score?
      object.activity.article.en_main_idea
    else
      case activity.category
      when "Main Idea","Signaling" then activity.article.en_main_idea
      else
        raise NotImplementedError,
          "Cannot find answer for category: #{activity.category}"
      end
    end
  end
end