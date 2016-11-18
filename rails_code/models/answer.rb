##
# Represents a correct answer to an activity question.
class Answer < ActiveRecord::Base
  validates :content, presence: true
  validates :question, presence: true
  validates :response, presence: true

  belongs_to :question
  belongs_to :response
end
