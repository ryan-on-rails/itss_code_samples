##
# Represents the assignment of a lesson to a particular
# course (lesson sequence).
class CourseLesson < ActiveRecord::Base
  include Orderable
  acts_as_paranoid

  validates :course, presence: true
  validates :lesson, presence: true
  validates :position, presence: true, numericality: true

  belongs_to :course
  belongs_to :lesson

  # Scope for Orderable
  def orderables
    course.course_lessons
  end
end
