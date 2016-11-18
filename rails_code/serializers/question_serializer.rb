class QuestionSerializer < ActiveModel::Serializer
  attributes :id, :content, :words_string, :detail_words_string, :main_idea_words_string, :signaling_words_string

  has_many :fill_in_blank_fields
  has_many :words

  def detail_words_string
  	object.detail_words.map{|w| w.content if w.present?}.join(", ")
  end
  def main_idea_words_string
  	object.main_idea_words.map{|w| w.content}.join(", ")
  end
  def signaling_words_string
  	object.signaling_words.map{|w| w.content}.join(", ")
  end
  def words_string
  	object.words.pluck(:content).join(", ")
  end
end
