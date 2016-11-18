class MainIdeaContentElementSerializer < ContentElementSerializer
  has_one :article, serializer: ArticleMainIdeaSerializer
end
