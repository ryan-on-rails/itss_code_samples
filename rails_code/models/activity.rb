##
# Represents a single activity in a broader lesson.
class Activity < ActiveRecord::Base
  include Orderable
  include ModelResponseDecorator
  include QuestionDescriptionDecorator
  acts_as_paranoid

  # NOTE: Used to apply category-specific scoring strategy
  CATEGORIES = ["Info", "Main Idea", "Recall", "Signaling", "Structure", "Writing"]

  TYPES = %W[Info MultipleChoice Composition DepthTest FillInBlank
          DragToMatch FindAndClick Game Matrix QuestionAnswer Tree WordBank]

  validates :type, presence: true
  validates :category, inclusion: { in: CATEGORIES }
  validates :position, presence: true, numericality: true
  validates :page, presence: true

  belongs_to :page
  has_many :feedback_conditions, dependent: :destroy
  has_many :responses #, dependent: :destroy

  # NOTE: We are more concerned about specific conditions; this
  # is merely for verification convenience
  has_many :feedbacks, through: :feedback_conditions
  has_many :monologues, -> { order(:position) }, dependent: :destroy

  has_many :activity_signaling_words, class_name: "ActivitySignalingWord", table_name: :activity_words, dependent: :destroy
  has_many :signaling_words, through: :activity_signaling_words, source: :word
  has_many :activity_structure_words, class_name: "ActivityStructureWord", table_name: :activity_words, dependent: :destroy
  has_many :structure_words, through: :activity_structure_words, source: :word
  has_many :activity_main_idea_words, class_name: "ActivityMainIdeaWord", table_name: :activity_words, dependent: :destroy
  has_many :main_idea_words, through: :activity_main_idea_words, source: :word
  has_many :activity_detail_words, class_name: "ActivityDetailWord", table_name: :activity_words, dependent: :destroy
  has_many :detail_words, through: :activity_detail_words, source: :word

  ##
  # Retrieve list of unique words associated
  # with the activity.
  def words
    ActivityWord.where(activity: self).uniq.joins(:word).map(&:word)
  end

  def type_slug
    self.type.gsub("Activity", "")
  end

  ##
  # Returns the next activity (scoped to the lesson)
  def next_activity
    remaining_page_activities = orderables.where("position > ?", position).order(:position)

    if remaining_page_activities.any?
      remaining_page_activities.first
    elsif next_page = page.next_page
      next_page.activities.first
    else
      nil
    end
  end

  ##
  # Retrieve the article that is most likely
  # to be associated with the activity.
  def article
    return nil unless page.present?  
    if article = page.article
      article
    else
      return nil unless page.present?  
      ce_type = "ArticleContentElement"
      _page = page.lesson.pages.where("pages.position < ?", page.position).
        joins(:content_elements).
        where("content_elements.type = ?", ce_type).last
      return nil unless _page.present?  
      _page.content_elements.find_by(type: ce_type).article
    end
  end

  def last_on_page?
    self == page.activities.last
  end

  def first_in_lesson?
    self == page.activities.first &&
      page == page.lesson.pages.first
  end

  def last_in_lesson?
    self == page.activities.last &&
      page == page.lesson.pages.last
  end

  # Scope for Orderable
  def orderables
    page ? page.activities : []
  end
end
