##
# Represents a content element that displays the main idea
# for a particular article. The structure is also displayed.
class MainIdeaContentElement < ContentElement
  validates :article, presence: true

  belongs_to :article
end
