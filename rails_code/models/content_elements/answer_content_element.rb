# Represents a content element that includes
# a student's "answer" to a previous activity.
class AnswerContentElement < ContentElement
  validates :activity, presence: true
  validates :show_student_answer, presence: true

  # NOTE: show_student_answer indicates whether we
  # should display the student's best answer or the
  # absolutely correct answer.
  before_validation :default_show_student_answer, on: :create

  belongs_to :activity

  def get_answer_for_user(user)
    return nil unless user.present?
    user.last_response_to_activity(activity)
  end

  private

  def default_show_student_answer
    return unless show_student_answer.nil?
    self.show_student_answer = true
  end
end
