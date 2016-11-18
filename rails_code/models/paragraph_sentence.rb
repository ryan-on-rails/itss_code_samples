class ParagraphSentence < ActiveRecord::Base
  belongs_to :paragraph, foreign_key: :paragraph_id
  belongs_to :sentence, foreign_key: :sentence_id
  
  def delete_sentence
    sentence.sentence_words.map{|sentence_word| sentence_word.destroy }
    destroy
    sentence.destroy
  end
end
