##
# Represents a multiple choice question for a MultipleChoiceActivity.
class MultipleChoiceQuestion < ActiveRecord::Base
  validates :content, presence: true
  validates :activity, presence: true
  acts_as_paranoid

  belongs_to :activity
  has_many :multiple_choice_options, -> { order 'multiple_choice_options.id' }, dependent: :destroy

  alias_method :options, :multiple_choice_options

  def correct_options
    multiple_choice_options.where(correct: true)
  end
end
