##
# Represents a content element that displays a piece of media
# image for now, possibly a video in the future.
class MediaContentElement < ContentElement
  has_attached_file :media

  # Validate content type
  validates_attachment_content_type :media, content_type: [/\Aimage/, /video/]
  # Validate filename
  validates_attachment_file_name :media, matches: [/png\Z/,/gif\Z/, /jpe?g\Z/, /webm\Z/, /mp3\Z/, /mp4\Z/]

end
