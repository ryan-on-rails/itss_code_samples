class FindAndClickActivitySerializer < ActivitySerializer
  has_one :question, serializer: FindAndClickQuestionSerializer
end