class StudentSentenceSerializer < ActiveModel::Serializer
  attributes :id, :sentence, :sentence_index, :words

  has_many :sentence_synonyms, serializer: SynonymSentenceSerializer
  def sentence
    object.to_s
  end
  def sentence_index
    1
  end
  def words
    object.sentence_words.includes(word: [:language, :known_abbreviations]).map { |sw| StudentWordSerializer.new(sw.word, context: {default_translation_id: sw.default_translation_id}) }
  end
end
