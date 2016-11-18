class MultipleChoiceQuestionSerializer < ActiveModel::Serializer
  attributes :id, :content, :answer_count

  has_many :options

  def answer_count
    self.options.where(correct: true).count
  end
end
