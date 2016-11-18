class RichTextContentElementSerializer < ContentElementSerializer
  attributes :en_content, :es_content, :en_translations, :es_translations

  def en_translations
    string = object.en_content
    WordService.new.get_kvp_from_blob(string)

  end
  def es_translations
    string = object.es_content
    WordService.new.get_kvp_from_blob(string, 'es')
  end

end
