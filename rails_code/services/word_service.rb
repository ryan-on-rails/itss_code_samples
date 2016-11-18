class WordService
  def initialize()
  end

  def get_word_collection_from_blob(blob, language_abbv='en')
    language = Language.find_by(abbv: language_abbv)
    return if blob.blank? || language.blank?
    str_array = blob.split(" ")
    word_array = str_array.map do |str|  
      word = Word.find_or_create_by(content: str.gsub(/[\.!,:;\[\]{}()]/, ''), language: language)
      StudentWordSerializer.new(word)
    end
    word_array
  end
  def get_kvp_from_blob(blob, language_abbv='en')
    language = Language.find_by(abbv: language_abbv)
    return if blob.blank? || language.blank?    

    #add some common words that might be needed
    if language_abbv == 'en'
      blob += " example table important structure signaling the main idea for Example Table Important Structure Signaling The For"
    else
      blob += " ejemplo tabla importante estructure seneladas la el princial idea por Ejemplo Tabla Importante Estructure Seneladas Por Princial"
    end
    str_array = blob.gsub(/[\.!,:;\[\]{}&()]/, '').split(" ").uniq    
    translation_hash = {}


    str_array.each do |str|  
      translation = nil
      word = Word.find_or_create_by(content: str, language: language)
      if language_abbv == "en"
        translation = word.get_spanish_translations().first
      else
        translation = word.get_english_translations().first
      end
      next if translation.blank?
      translation_hash[word.content] = translation.content
    end
    translation_hash
  end
end
