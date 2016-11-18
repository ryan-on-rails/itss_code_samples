##
# Represents a word that counts as a valid answer
# to the associated matrix question cell.
class MatrixQuestionsWord < ActiveRecord::Base
  validates :matrix_question, presence: true
  validates :word, presence: true

  belongs_to :matrix_question
  belongs_to :word
end
