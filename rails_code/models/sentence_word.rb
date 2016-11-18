class SentenceWord < ActiveRecord::Base
  before_create :set_position
  belongs_to :sentence, foreign_key: :sentence_id
  belongs_to :word, foreign_key: :word_id
  belongs_to :default_translation, :class_name => "Word", foreign_key: :default_translation_id

  def content
    word.content
  end
  def translation_content
    default_translation.present? ? default_translation.content : ""
  end

  def set_position
    return if self.position.present?
    self.position = sentence.words.count
  end
end
