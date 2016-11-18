class LessonResourcesSerializer < ActiveModel::Serializer
  attributes :resources

  def resources
    {
      lessons: object.map do |lesson|
        {
          id: lesson.id,
          title: lesson.title,
          resources: resource_map(lesson)
        }
      end
    }
  end

  private

  def resource_map(lesson)
    lesson.lesson_attachments.map do |la|
      { file_name: la.attachment_file_name,
        id: la.id,
        file_type: file_type(la.attachment_content_type),
        size: la.attachment_file_size,
        url: la.attachment.url
      }
    end
  end

  def file_type(mime)
    case mime
    when /\Aimage\//
      'image'
    when /\Atext\//
      'text'
    when /\Avideo\//
      'video'
    when /\Aaudio\//
      'audio'
    else
      mime
    end
  end
end
