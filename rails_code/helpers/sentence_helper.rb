require 'language_processor'
require 'ostruct'

module SentenceHelper

  def self.construct_sentences(raw_text, language_abbv='en')
    language = Language.find_by(abbv: language_abbv)
    sentence_collection = SentenceCollection.new()

    # not strictly necessary, this saves all parts of punctuated
    #   words/words containin non_alpha characters -->
    save_words raw_text.split(/[^[:word:]\s]|\s|_/), language

    LanguageProcessor.split_into_sentences(raw_text).each do |sentence_as_array|
      sentence_collection.add construct_sentence(sentence_as_array, language)
    end
    sentence_collection
  end

  def self.construct_sentence(sentence_as_array, language)
    sentence = Sentence.create()
    phrasing = LanguageProcessor.get_sentence_phrasing sentence_as_array #.map{|sentence_word| LanguageProcessor.get_spatially_punctuated_phrasing sentence_word}.flatten
    save_words(phrasing.map{|x| x.word}, language).each_with_index.map{|saved_word, index|
      matched_sentence_word = phrasing.detect{|x| x.content == saved_word.content }.to_sentence_word(saved_word)
      matched_sentence_word.position = index
      matched_sentence_word.sentence_id = sentence.id
      matched_sentence_word.save!
    }
    sentence.reload
  end

  def self.translate_sentence(sentence, language_abbv)
    # result sentence -> [could|look|like] [::missing::] this
    # it's is a little dirty, but it's a good idea of how to translate sentences
    return sentence.sentence_words.map{|s_word|
      translation = s_word.word.get_translations(language_abbv)
      translations = translation.map{|t|t.content}
      # if no translations -> ::missing::
      if translation.empty? && !s_word.is_non_alpha
        ['[::missing::]']
      elsif s_word.is_non_alpha
        nil
      else
        # if one translation -> word
        # if multiple translations -> [word1|word2|word3]
        translations.length == 1 ? translations[0] : "[#{translations.join('|')}]"
      end
    }.compact.join(' ')
  end

  def self.save_words(words, language)
    words.map{|word_content|
      Word.find_or_initialize_by({ content: word_content, language_id: language.id  }) do |wrd| wrd.save end
    }
  end

  def self.sentence_words_to_sentence_string(sentence_words)
    return LanguageProcessor.spatial_phrasing_to_s sentence_words
  end

end
