class Page < ActiveRecord::Base
  include Orderable
  acts_as_paranoid

  validates :lesson, presence: true
  validates :position, presence: true, numericality: true

  has_many :activities, -> { order(:position) }, dependent: :destroy
  has_many :content_elements, -> { order(:position) }, dependent: :destroy
  belongs_to :lesson

  # Get a page's (ostensibly) only article
  def article
    content_elements.find_by(type: "ArticleContentElement").try(:article)
  end

  # Returns the next page in the parent lesson
  def next_page
    orderables.find_by(position: position + 1)
  end

  # Scope for Orderable
  def orderables
    lesson.pages
  end
end
