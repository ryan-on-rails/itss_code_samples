class MatrixAnswerSerializer < ActiveModel::Serializer
  attributes :matrix_question_id

  has_many :words
end
