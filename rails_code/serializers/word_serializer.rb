class WordSerializer < BaseWordSerializer
  attributes :translations, :word_index, :default_translation_id

  def translations
    if object.language.abbv == "en"
      translations = object.get_spanish_translations()
    else
      translations = object.get_english_translations()
    end
    translations.map{|tw| BaseWordSerializer.new(tw)}
  end
  def word_index
    1
  end
  def default_translation_id
    return nil unless context.present?
    context[:default_translation_id] || nil
  end
end
