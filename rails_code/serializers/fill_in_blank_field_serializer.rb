class FillInBlankFieldSerializer < ActiveModel::Serializer
  attributes :id, :position, :question_id

  has_many :words
end
