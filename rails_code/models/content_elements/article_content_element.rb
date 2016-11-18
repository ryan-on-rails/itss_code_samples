# Represents an article content element.
class ArticleContentElement < ContentElement
  validates :article, presence: true

  belongs_to :article

  before_validation :default_show_title, on: :create

  def default_show_title
    self.show_title = true if show_title.nil?
  end
end
