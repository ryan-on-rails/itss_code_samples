##
# Represents the association between an article and a
# word/phrase of a particular classification (type).
class ArticleWord < ActiveRecord::Base
  validates :article, presence: true
  validates :word, presence: true
  validates :type, presence: true

  belongs_to :article
  belongs_to :word
end
