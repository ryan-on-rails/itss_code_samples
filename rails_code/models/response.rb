##
# Represents a student's response to an activity and
# the scores for that response.
class Response < ActiveRecord::Base
  validates :user, presence: true
  validates :activity, presence: true
  validates :attempt, numericality: true
  acts_as_paranoid

  before_create :assign_attempt

  belongs_to :user
  belongs_to :activity

  # Activity-type-specific associations
  has_many :answers, dependent: :destroy
  has_many :matrix_answers, dependent: :destroy
  has_many :tree_answers, dependent: :destroy
  has_many :multiple_choice_answers, dependent: :destroy
  has_many :fill_in_blank_answers, dependent: :destroy
  has_one :find_and_click_answer, dependent: :destroy

  def max_attempt
    self.activity.feedback_conditions.present? ? self.activity.feedback_conditions.pluck(:attempt).uniq.max : 10
  end

  private

  def assign_attempt
    _attempt = 1
    lr = Response.where(user: user, activity: activity).order(created_at: :desc).first
    # max_feedback_condition = self.activity.feedback_conditions.find_by(feedback: Feedback.find_by(slug: "moveon"))
    # max_attempt = max_feedback_condition.present? ? max_feedback_condition.attempt : 10
    max_attempt = self.max_attempt
    OaLogger.info("max attempt")
    OaLogger.info(max_attempt)

    #need to take into account a teacher moving a student to an activity they've already done
    if lr.present? && !lr.is_passing_score && lr.attempt < max_attempt
      _attempt = lr.attempt + 1
    end
    self.attempt = _attempt
  end

end
