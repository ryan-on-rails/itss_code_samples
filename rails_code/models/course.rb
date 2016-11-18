##
# Represents a sequence of lessons.
class Course < ActiveRecord::Base
  acts_as_paranoid
  validates :name, presence: true

  has_many :course_lessons, dependent: :destroy
  has_many :lessons, -> { order(:number) }, through: :course_lessons

end
