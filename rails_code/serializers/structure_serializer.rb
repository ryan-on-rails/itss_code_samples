class StructureSerializer < ActiveModel::Serializer
  attributes :id, :name, :es_name, :description, :example, :signaling_words
end
