class ParagraphSerializer < ActiveModel::Serializer
  attributes :id

  has_many :sentences, serializer: SentenceSerializer

end
