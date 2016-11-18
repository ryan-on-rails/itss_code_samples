##
# Represents a content element that displays the recall text
# for a particular article.
class RecallContentElement < ContentElement
  validates :article, presence: true

  belongs_to :article
end
