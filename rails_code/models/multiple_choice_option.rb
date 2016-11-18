##
# Represents an answer option for a MultipleChoiceQuestion.
class MultipleChoiceOption < ActiveRecord::Base
  validates :label, presence: true
  validates :multiple_choice_question, presence: true
  acts_as_paranoid

  belongs_to :multiple_choice_question
end
