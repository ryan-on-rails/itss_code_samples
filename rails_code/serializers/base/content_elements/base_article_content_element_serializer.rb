class BaseArticleContentElementSerializer < ContentElementSerializer
  attributes :show_title

  has_one :article, serializer: BaseArticleSerializer
end
