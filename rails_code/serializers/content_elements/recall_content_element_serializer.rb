class RecallContentElementSerializer < ContentElementSerializer
  has_one :article, serializer: ArticleRecallSerializer
end
