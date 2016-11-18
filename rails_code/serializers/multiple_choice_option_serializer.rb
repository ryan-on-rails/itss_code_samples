class MultipleChoiceOptionSerializer < ActiveModel::Serializer
  attributes :id, :label, :correct, :multiple_choice_question_id
end
