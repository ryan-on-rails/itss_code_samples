class BaseCourseSerializer < ActiveModel::Serializer
  attributes :id, :name, :lessons, :description

  def lessons
  	lessons = object.lessons
  	lessons = lessons.where(published: true) if !scope.admin?
    lessons.order(:number).map { |lesson| BaseLessonSerializer.new(lesson, scope: object) }
  end
end
