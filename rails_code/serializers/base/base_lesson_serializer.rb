class BaseLessonSerializer < ActiveModel::Serializer
  attributes :id, :title, :number, :description,
    :remedial_next_lesson_id, :default_next_lesson_id, :advanced_next_lesson_id,
  	:default_pass_feedback_id, :default_fail_feedback_id, :published, :structure_id

  has_many :course_ids
  
  def course_ids
    object.courses.pluck(:id)
  end
end
