class Word < ActiveRecord::Base
  validates :content, presence: true, uniqueness: { scope: [:content, :language_id] }

  has_many :translations, foreign_key: :source_word_id
  has_many :misspellings, dependent: :destroy
  has_many :known_abbreviations, dependent: :destroy
  has_many :questions_words, dependent: :destroy
  belongs_to :language
  before_destroy -> { synonym_pairs.destroy_all }

  alias_attribute :make_abbreviation, :make_well_known_abbreviation
  alias_attribute :make_known_abbreviation, :make_well_known_abbreviation
  alias_attribute :remove_abbreviation, :remove_well_known_abbreviation
  alias_attribute :remove_known_abbreviation, :remove_well_known_abbreviation
  alias_attribute :is_abbv?, :is_well_known_abbreviation?

  # has_many
  def synonym_pairs
    SynonymPair.where("word1_id = ? or word2_id = ?", id, id)
  end

  # has_many, through
  def synonyms
    synonym_pairs.includes(:word1, :word2).map { |pair|
      pair.word1_id == id ? pair.word2 : pair.word1
    }
  end

  def get_spanish_translations()
    return [] if language.abbv == 'es' #<-- [] if current word lang is spanish
    get_translations('es')
  end

  def get_english_translations()
    return [] if language.abbv == 'en' #<-- [] if current word lang is english
    get_translations('en')
  end

  def get_translations(target_language_abbv)
    return [] if content.match(/^[[:alpha:]]+$/).nil? #<-- word is non_alpha; no translations
    target_language = Language.find_by({ abbv: target_language_abbv })
    transitivity = LanguageTransitive.find_by({ source_language_id: language_id, target_language_id: target_language.id})
    # translations.select{ |t| t.language_transitive_id == transitivity.id }.map{ |t| t.word }
    Word.where(id: translations.where(language_transitive_id: transitivity.id).pluck(:target_word_id))
  end

  def create_spanish_translation(word_text)
    return nil if language.abbv == 'es' #<-- nil if current word lang is spanish
    create_translation(word_text, 'es')
  end

  def create_english_translation(word_text)
    return nil if language.abbv == 'en' #<-- nil if current word lang is english
    create_translation(word_text, 'en')
  end

  def create_translation(word_text, target_language_abbv)
    target_language = Language.find_by({ abbv: target_language_abbv})
    word_to_translate = Word.find_or_initialize_by({ content: word_text, language_id: target_language.id }) do | new_word | new_word.save end

    raise "Could not save word #{word_text} for translation!" if word_to_translate.id.nil?

    Translation.find_or_initialize_by({
      source_word_id: id,
      target_word_id: word_to_translate.id,
      language_transitive_id: LanguageTransitive.find_or_initialize_by({ source_language_id: language_id, target_language_id: target_language.id }).id
    }) do |trans| trans.save end
  end

  def make_well_known_abbreviation
    return nil if id.nil?
    KnownAbbreviation.find_or_initialize_by(word_id: id){|abbv| abbv.save }
  end
  def remove_well_known_abbreviation
    return nil if id.nil?
    KnownAbbreviation.find_by(word_id: id).destroy
  end
  def is_well_known_abbreviation?
    return false if id.nil?
    KnownAbbreviation.find_by(word_id: id).present?
  end

end
