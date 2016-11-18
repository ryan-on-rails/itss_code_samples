class StructureWordsSerializer < ActiveModel::Serializer
  attributes :id, :name, :es_name, :description, :example, :signaling_words,
      :es_name, :es_description, :es_example, :es_signaling_words,
      :en_translations, :es_translations

  def en_translations
    string = ""
    en_name = object.name.present? ? object.name : ""
    en_description = object.description.present? ? object.description : ""
    en_example = object.example.present? ? object.example : ""
    en_signaling_words = object.signaling_words.present? ? object.signaling_words : ""

    string = en_name+" "+en_description+" "+en_example+" "+en_signaling_words
    WordService.new.get_kvp_from_blob(string)

  end
  def es_translations
    string = ""
    es_name = object.es_name.present? ? object.es_name : ""
    es_description = object.es_description.present? ? object.es_description : ""
    es_example = object.es_example.present? ? object.es_example : ""
    es_signaling_words = object.es_signaling_words.present? ? object.es_signaling_words : ""

    string = es_name+" "+es_description+" "+es_example+" "+es_signaling_words
    WordService.new.get_kvp_from_blob(string, 'es')
  end
end
