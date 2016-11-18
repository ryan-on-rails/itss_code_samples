##
# Represents a sequence of activities through pages.
class Lesson < ActiveRecord::Base
  acts_as_paranoid
  validates :number, presence: true, numericality: true
  validates :description, presence: true

  # A student can be moved to one of three next lessons
  # depending on their score for the current lesson
  belongs_to :remedial_next_lesson, class_name: "Lesson"
  belongs_to :default_next_lesson, class_name: "Lesson"
  belongs_to :advanced_next_lesson, class_name: "Lesson"
  belongs_to :structure
  has_many :pages, -> { order(:position) }, dependent: :destroy
  has_many :monologues, -> { order(:position) }, dependent: :destroy
  has_many :lesson_attachments, :dependent => :destroy
  has_many :course_lessons, :dependent => :destroy
  has_many :courses, through: :course_lessons
  belongs_to :default_pass_feedback, class_name: "Feedback"
  belongs_to :default_fail_feedback, class_name: "Feedback"

  def activities
    pages.includes(:activities).flat_map(&:activities)
  end

  def activities_with_category(category)
    pages.joins(:activities).
      where("activities.category = ?", category).
      flat_map(&:activities)
  end
end
