class Student < User
  attr_encrypted :plain_pass, :key => Rails.application.config.secret_token, :mode => :per_attribute_iv_and_salt
  attr_encryptor :plain_pass, :key => "3d30f7bfc3a526d55924d877110b05e53ea84037da5d5d97f9c197c3251e4e3ee7ca3de53d5c4c763bd695a11021fb1fcee16cf86a698d57722b3e1eef7c0c23"

  belongs_to :classroom
  belongs_to :current_activity, class_name: "Activity"
  belongs_to :course
  has_many :test_records
  has_many :responses, foreign_key: :user_id
  validates_presence_of :current_activity
  has_many :student_locked_lessons, foreign_key: "user_id"
  enum writing_ability: { low: 0, medium: 1, high: 2 }
  enum learning_disability: { none_specified: 0, learning_support: 1, special_ed:2, emotional_support: 3, other: 4 }

  before_create :set_plain_pass

  ##
  # Serialize the appropriate data needed as a student
  def serialize!
    ClientStateSerializer.new(self)
  end

  ##
  # Can the user actually use the application
  def is_supported?
    true
  end

  ##
  # Returns if this user has access to WeWrite
  def wewrite_access?
    return self.classroom.wewrite_access
  end

  ##
  # Returns if this user has access to ITSS
  def itss_access?
    return self.classroom.itss_access
  end

  ##
  # What is the default route that this type of user should be
  # redirected to on login
  def application_root
    '/'
  end

  ##
  # Returns the student's current lesson
  def current_lesson
    current_activity.page.lesson rescue nil
  end

  ##
  # Is the student's current activity in this lesson?
  # If not, do they have any responses to activities
  # in this lesson?
  def has_started_lesson?(lesson)
    activities = lesson.activities

    return true if activities.include?(current_activity)
    responses && responses.where(activity: activities).any?
  end

  def has_completed_lesson?(lesson)
    last_in_lesson = lesson.activities.last
    responses.where(activity: last_in_lesson, is_passing_score: true).any?
  end

  ##
  # Returns an integer percentage that represents
  # a student's progress through a lesson.
  def progress_for_lesson(lesson)
    total = lesson.activities.count || 0
    complete = responses.where(
      activity_id: lesson.activities.map(&:id),
      is_passing_score: true).uniq { |r| r.activity_id }.count

    ((complete.to_f / total) * 100).to_i
  end

  def last_response_to_activity(activity)
    responses.includes(:activity).where(activity: activity).order(attempt: :desc).first
  end

  private

  ##
  # Stores a plain-text copy of the password for teacher lookup
  def set_plain_pass
    self.plain_pass = self.password
  end
end
