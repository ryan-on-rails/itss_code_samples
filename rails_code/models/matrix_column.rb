##
# Represents a matrix column in a matrix activity.
class MatrixColumn < ActiveRecord::Base
  validates :label, presence: true
  validates :activity, presence: true
  acts_as_paranoid

  belongs_to :activity
  has_many :matrix_questions, dependent: :destroy
end
