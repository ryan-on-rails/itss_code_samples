class ArticleContentElementSerializer < ContentElementSerializer
  attributes :show_title

  has_one :article, serializer: StudentArticleSerializer
end
