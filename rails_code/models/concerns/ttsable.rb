module TTSable
  extend ActiveSupport::Concern

  # -----------------------------------------------------------------
  # Mixin for models that have TTS attributes
  # -----------------------------------------------------------------

  included do
    validates :slug, presence: true

    has_attached_file :en_audio, styles: { original: {} },
      processors: [:tts_audio_processor]
    has_attached_file :es_audio, styles: { original: {} },
      processors: [:tts_audio_processor]

    # TODO: Validation was buggy; revisit
    do_not_validate_attachment_file_type :en_audio
    do_not_validate_attachment_file_type :es_audio
  end

  def en_audio_path
    en_audio.url
  end

  def es_audio_path
    es_audio.url
  end

  
end
