class TreeQuestionSerializer < ActiveModel::Serializer
  attributes :id, :label
  has_many :words
end
