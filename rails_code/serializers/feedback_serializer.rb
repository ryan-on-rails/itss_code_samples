class FeedbackSerializer < ActiveModel::Serializer
  attributes :id, :en_text, :es_text, :en_viseme_data,
    :es_viseme_data, :en_audio_path, :es_audio_path,
    :slug
end