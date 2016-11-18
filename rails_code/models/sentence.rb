class Sentence < ActiveRecord::Base
  include SentenceHelper

  alias_attribute :synonyms, :sentence_synonyms
  has_many :sentence_synonyms, foreign_key: :base_sentence_id
  has_many :synonym_sentences, through: :sentence_synonyms
  has_many :sentence_words, -> { order 'sentence_words.position' }
  has_many :words, -> { order 'sentence_words.position' }, through: :sentence_words
  has_many :paragraph_sentences, dependent: :destroy
  has_many :paragraphs, through: :paragraph_sentences

  def self.construct_sentences(text, language_abbv='en')
    SentenceHelper.construct_sentences(text,language_abbv)
  end

  # TODO -- revisit this now that sentence construction w/ punctuation and non_aphas is working correctly-->
  def translate(language_abbv)
    SentenceHelper.translate_sentence(self, language_abbv)
  end

  def create_sentence_synonym(text, language_abbv)
    synonym_sentence_coll = SentenceHelper.construct_sentences(text,language_abbv)

    # synonym_sentences must be a single sentence (not multiple sentences) -->
    if synonym_sentence_coll.sentences.length > 1
      synonym_sentence_coll.destroy
      raise 'cannot create sentence synonym from multiple sentences!'
    end

    SentenceSynonym.create(base_sentence_id: id, synonym_sentence_id: synonym_sentence_coll.sentences[0].id)
  end
  def update_sentence_synonym(text, language_abbv, sentence_synonym_id)
    synonym_sentence_coll = SentenceHelper.construct_sentences(text,language_abbv)

    # synonym_sentences must be a single sentence (not multiple sentences) -->
    if synonym_sentence_coll.sentences.length > 1
      synonym_sentence_coll.destroy
      raise 'cannot create sentence synonym from multiple sentences!'
    end

    SentenceSynonym.find(sentence_synonym_id).update(synonym_sentence_id: synonym_sentence_coll.sentences[0].id)
  end

  def paragraph_sentence
    paragraph_sentences.first  
  end
  def paragraph
    paragraphs.first
  end
  def reset_sentence_word_positions
    sentence_words.each do |sw, i|
      sw.update(position: i)
    end
  end


  def to_s()
    _words = SentenceWord.includes(:word).where(sentence_id: self.id)
    SentenceHelper.sentence_words_to_sentence_string _words
  end

end
