class FindAndClickRepresentationSerializer < RepresentationSerializer
  attributes :answer

  def answer
    if object.is_a?(Response) && object.is_passing_score?
      object.find_and_click_answer.words.pluck(:content)
    else
      activity.question.words.pluck(:content)
    end
  end
end