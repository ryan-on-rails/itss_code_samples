class MediaContentElementSerializer < ContentElementSerializer
  attributes :media, :media_content_type, :media_url, :media_is_attached,
    :media_is_image, :media_is_video

  def media_url
    object.media.url
  end
  def media_is_attached
    object.media.present?
  end
  def media_is_image
    return false if object.media.blank?
    !!object.media_file_name.match(/\.(png|gif|jpg|jpeg)$/i)
  end
  def media_is_video
    return false if object.media.blank?
    !!object.media_file_name.match(/\.(mp4|mng|mov|wmv|webm)$/i)
  end
end
