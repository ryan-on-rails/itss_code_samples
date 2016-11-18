class StudentWordSerializer < BaseWordSerializer
  attributes :word_index, :default_translation

  def word_index
    1
  end
  def default_translation
    if context.present? && context[:default_translation_id].present?
      translation = Word.find_by(id: context[:default_translation_id])
    end
    if translation.blank?
      if object.language.abbv == "en"
        translation = object.get_spanish_translations().first
      else
        translation = object.get_english_translations().first
      end
    end
    return nil if translation.blank?
    BaseWordSerializer.new(translation)
  end
end
