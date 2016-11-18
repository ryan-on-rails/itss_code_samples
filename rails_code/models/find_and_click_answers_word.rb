##
# Represents a word chosen as part of a particular FindAndClickAnswer.
class FindAndClickAnswersWord < ActiveRecord::Base
  validates :find_and_click_answer, presence: true
  validates :word, presence: true

  belongs_to :find_and_click_answer
  belongs_to :word
end
