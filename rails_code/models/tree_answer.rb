##
# Represents a student's answer for a particular question
# node in a TreeActivity.
class TreeAnswer < ActiveRecord::Base
  validates :content, presence: true
  validates :response, presence: true
  validates :tree_question, presence: true

  belongs_to :response
  belongs_to :tree_question
end
