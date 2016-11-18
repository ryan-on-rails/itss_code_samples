class ContentElementSerializer < ActiveModel::Serializer
  attributes :id, :type, :clickable, :page_id, :article_id
end
