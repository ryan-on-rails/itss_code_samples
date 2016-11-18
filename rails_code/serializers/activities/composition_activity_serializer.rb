class CompositionActivitySerializer < ActivitySerializer
  has_many :questions, serializer: CompositionQuestionSerializer
end
