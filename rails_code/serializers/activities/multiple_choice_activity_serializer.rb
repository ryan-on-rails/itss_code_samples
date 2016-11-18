class MultipleChoiceActivitySerializer < ActivitySerializer
  has_one :question, serializer: MultipleChoiceQuestionSerializer
end
