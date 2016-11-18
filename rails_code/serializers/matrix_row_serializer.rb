class MatrixRowSerializer < ActiveModel::Serializer
  attributes :id, :label

  has_many :matrix_questions

  def matrix_questions
  	col_ids = object.activity.matrix_columns.pluck(:id)
  	q_col_ids = object.matrix_questions.pluck(:matrix_column_id)
  	questions = []
  	col_ids.each do |id| 
  		index = q_col_ids.index(id)
  		questions.push(object.matrix_questions[index]) if index.present?
  	end

  	questions
  end
end
