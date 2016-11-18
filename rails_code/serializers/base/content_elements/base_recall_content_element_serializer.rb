class BaseRecallContentElementSerializer < ContentElementSerializer
  has_one :article, serializer: BaseArticleSerializer
end
