class SentenceSerializer < ActiveModel::Serializer
  attributes :id, :sentence, :sentence_index, :words, :sentence_position

  has_many :sentence_synonyms, serializer: SynonymSentenceSerializer
  def sentence
    object.to_s
  end
  def sentence_index
    1
  end

  def sentence_position
    object.paragraph_sentence.position
  end
  def words
    object.sentence_words.map { |sw| WordSerializer.new(sw.word, context: {default_translation_id: sw.default_translation_id}) }
  end
end
