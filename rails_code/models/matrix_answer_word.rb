##
# Represents a word that a student has selected
# as part of the associated answer.
class MatrixAnswerWord < ActiveRecord::Base
  self.table_name = "matrix_answers_words"

  validates :matrix_answer, presence: true
  validates :word, presence: true

  belongs_to :matrix_answer
  belongs_to :word
end
