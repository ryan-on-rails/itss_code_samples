class TreeBranch < ActiveRecord::Base
  validates :parent_node, presence: true
  validates :child_node, presence: true

  belongs_to :parent_node, :class_name => 'TreeNode'
  belongs_to :child_node, :class_name => 'TreeNode'
end
