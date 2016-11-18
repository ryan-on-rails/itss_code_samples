class FindAndClickAnswerSerializer < ActiveModel::Serializer
  attributes :find_and_click_question_id

  has_many :words
end
