class AdminLessonSerializer < ActiveModel::Serializer
  attributes :id, :title, :number, :published,
    :remedial_next_lesson_id, :default_next_lesson_id, :advanced_next_lesson_id,
    :checkpoint, :is_first_lesson, :structure_id, :description, :default_pass_feedback_id, :default_fail_feedback_id

  has_one :structure
  has_many :course_ids
  has_many :monologues
  has_many :activities, serializer: BaseActivitySerializer
  has_many :pages, serializer: AdminPageSerializer
  has_many :lesson_attachments, serializer: LessonAttachmentSerializer

  def is_first_lesson
    first = Lesson.where(published: true).order(:number).first
    first.id == object.id
  end
  def course_ids
    object.courses.pluck(:id)
  end
end
