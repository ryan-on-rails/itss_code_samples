##
# Represents a word expected in the answer to a
# particular question.
class QuestionsWord < ActiveRecord::Base
  validates :question, presence: true
  validates :word, presence: true

  belongs_to :question
  belongs_to :word

  def my_question
  	self.question_id
  end
end
