class MatrixActivitySerializer < ActivitySerializer
  has_many :matrix_rows
  has_many :matrix_columns
  has_many :matrix_questions
end
