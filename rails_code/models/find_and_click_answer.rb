##
# Represents an answer for a particular FindAndClickQuestion.
class FindAndClickAnswer < ActiveRecord::Base
  include Wordsable

  validates :response, presence: true
  validates :find_and_click_question, presence: true

  belongs_to :response
  belongs_to :find_and_click_question
end
