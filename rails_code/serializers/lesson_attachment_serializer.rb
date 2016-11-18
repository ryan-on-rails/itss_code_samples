class LessonAttachmentSerializer < ActiveModel::Serializer
  attributes :id, :attachment_file_name, :attachment_url, :attachment_path, :attachment_content_type

  def attachment_url
    object.attachment.url
  end
  def attachment_path
    object.attachment.path
  end
end
