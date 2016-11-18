##
# Represents a "correct" word for a FindAndClickQuestion.
class FindAndClickQuestionsWord < ActiveRecord::Base
  validates :find_and_click_question, presence: true
  validates :word, presence: true

  belongs_to :find_and_click_question
  belongs_to :word
end
