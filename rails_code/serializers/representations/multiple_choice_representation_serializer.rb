class MultipleChoiceRepresentationSerializer < RepresentationSerializer
  attributes :answer

  def answer
    if object.is_a?(Response) && object.is_passing_score?
      object.multiple_choice_answers.includes(:multiple_choice_option).
        pluck(:label)
    else
      activity.question.options.where(correct: true).pluck(:label)
    end
  end
end