class ClassroomStructureSerializer < ActiveModel::Serializer
  attributes :id, :name, :description

  has_many :lessons
  
  def lessons
  	object.lessons.map do|lesson| 
  		if lesson.course_lessons.where(course_id: 1).count
  			ClassroomLessonSerializer.new(lesson)
  		end  		
  	end
  end
end
