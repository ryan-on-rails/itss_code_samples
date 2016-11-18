class BaseMainIdeaContentElementSerializer < ContentElementSerializer
  has_one :article, serializer: BaseArticleSerializer
end
