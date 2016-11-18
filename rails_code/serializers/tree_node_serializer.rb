class TreeNodeSerializer < ActiveModel::Serializer
  attributes  :id, :en_content, :es_content, :is_root_node?,
    :question?

  has_many :child_nodes
  has_one :tree_question
end
