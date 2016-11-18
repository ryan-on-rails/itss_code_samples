class BaseActivitySerializer < ActiveModel::Serializer
  attributes :id, :category, :instructions, :position, :page_id
end
