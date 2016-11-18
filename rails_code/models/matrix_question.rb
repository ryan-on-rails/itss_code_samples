##
# Represents a single cell in a matrix activity.
class MatrixQuestion < ActiveRecord::Base
  include Wordsable

  validates :matrix_row, presence: true, uniqueness: { scope: :matrix_column }
  validates :matrix_column, presence: true

  belongs_to :matrix_row
  belongs_to :matrix_column
end
