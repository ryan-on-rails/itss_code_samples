##
# Represents a written question within an activity.
class Question < ActiveRecord::Base
  include Wordsable
  acts_as_paranoid

  validates :activity, presence: true
  validates :content, presence: true

  belongs_to :activity
  has_many :fill_in_blank_fields, dependent: :destroy

  def signaling_words
    get_words_of_type("Signaling")
  end

  def main_idea_words
    get_words_of_type("MainIdea")
  end

  def detail_words
    get_words_of_type("Detail")
  end
  def structure_words
    get_words_of_type("Structure")
  end

  private

  def get_words_of_type(type)
    type = "Questions#{type}Word"
    QuestionsWord.where(type: type, question: self).includes(:word).map(&:word)
  end
end
