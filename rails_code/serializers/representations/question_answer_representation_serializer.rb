class QuestionAnswerRepresentationSerializer < RepresentationSerializer
  attributes :answer

  def answer
    if object.is_a?(Response) && object.is_passing_score?
      object.answers.pluck(:content).join(" ")
    else
      activity.question.words.pluck(:content).join(" ")
    end
  end
end