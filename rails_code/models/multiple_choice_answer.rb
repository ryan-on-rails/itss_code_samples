##
# Represents one of a student's answer selections for a
# MultipleChoiceQuestion activity. An activity response may be
# referenced by multiple MultipleChoiceAnswers; this is needed to
# support MultipleChoiceQuestions with multiple correct answer options.
class MultipleChoiceAnswer < ActiveRecord::Base
  validates :response, presence: true
  validates :multiple_choice_option, presence: true

  belongs_to :response
  belongs_to :multiple_choice_option

  def correct?
    multiple_choice_option.correct?
  end
end
