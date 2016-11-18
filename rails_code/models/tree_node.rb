class TreeNode < ActiveRecord::Base
  belongs_to :activity
  acts_as_paranoid

  has_one :tree_question, dependent: :destroy
  has_many :tree_branches, foreign_key: :parent_node_id
  has_many :child_nodes, through: :tree_branches, dependent: :destroy

  alias_method :question, :tree_question

  def is_root_node?
    !!activity_id
  end

  def question?
    !!tree_question
  end
end
