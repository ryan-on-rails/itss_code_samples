##
# An activity wherein students fill in tree nodes by
# typing answers -- e.g., L35.6Q3
class TreeActivity < Activity
  has_many :tree_nodes, dependent: :destroy, foreign_key: :activity_id
  alias_method :nodes, :tree_nodes

  def root_nodes
    tree_nodes.includes(child_nodes: [:child_nodes], tree_question: [:words])
  end

  def all_nodes
    childnodes = ->(node) {
      rnodes = []
      nodes = node.child_nodes
      rnodes += nodes
      rnodes += nodes.flat_map { |n| childnodes.(n) }
      rnodes
    }

    # Recursively fetch all child nodes
    root_nodes.flat_map { |n| childnodes.(n) }
  end
end
