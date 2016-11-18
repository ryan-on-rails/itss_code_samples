##
# Represents a question for a TreeActivity node.
class TreeQuestion < ActiveRecord::Base
  validates :label, presence: true
  acts_as_paranoid

  belongs_to :tree_node
  has_many :tree_question_words
  has_many :words, through: :tree_question_words
end
