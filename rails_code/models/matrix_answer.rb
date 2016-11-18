##
# Represents a single cell in a student's response to
# a matrix activity.
class MatrixAnswer < ActiveRecord::Base
  include Wordsable

  validates :response, presence: true
  validates :matrix_question, presence: true

  belongs_to :response
  belongs_to :matrix_question
end
