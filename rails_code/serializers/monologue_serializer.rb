class MonologueSerializer < ActiveModel::Serializer
  attributes :id, :position, :en_text, :es_text, :en_viseme_data, :slug, :en_audio_content_type,
    :es_viseme_data, :en_audio_path, :es_audio_path, :en_audio_text, :es_audio_text, :activity_id, :lesson_id
end
