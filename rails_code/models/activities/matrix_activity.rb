##
# An activity wherein students fill in matrix cells by clicking
# on words in the article -- e.g., L3aeQ3.1@2704
class MatrixActivity < Activity
  has_many :matrix_rows, dependent: :destroy, foreign_key: :activity_id
  has_many :matrix_columns, dependent: :destroy, foreign_key: :activity_id

  alias_attribute :rows, :matrix_rows
  alias_attribute :columns, :matrix_columns
  alias_attribute :questions, :matrix_questions

  def matrix_questions
    matrix_rows.includes(:matrix_questions).flat_map(&:matrix_questions)
  end
end
