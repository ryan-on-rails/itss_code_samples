##
# Represents a word that counts as a valid answer
# to the associated tree question.
class TreeQuestionWord < ActiveRecord::Base
  validates :tree_question, presence: true
  validates :word, presence: true

  belongs_to :tree_question
  belongs_to :word
end
