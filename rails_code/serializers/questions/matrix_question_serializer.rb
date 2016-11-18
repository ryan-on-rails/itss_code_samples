class MatrixQuestionSerializer < ActiveModel::Serializer
  attributes :id, :matrix_row_id, :matrix_column_id, :words_string, :populate

  has_many :words

  def words_string
  	object.words.pluck(:content).join(", ")
  end
end
