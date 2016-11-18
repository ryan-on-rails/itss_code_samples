class SynonymSentenceSerializer < ActiveModel::Serializer
  attributes :id, :sentence, :synonym_sentence_id, :image_url, :image_is_attached, :image_file_name

  def sentence
    object.synonym_sentence.to_s
  end
  def synonym_sentence_id
    object.synonym_sentence.id
  end
  def image_url
    object.image
  end
  def image_is_attached
    object.image.present?
  end
  def image_file_name
    object.image_file_name
  end

end
