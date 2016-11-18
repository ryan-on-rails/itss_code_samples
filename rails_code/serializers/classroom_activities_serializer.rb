class ClassroomActivitiesSerializer < ActiveModel::Serializer
  attributes :activities

  def activities
    activity_structures()
  end

  private

  def activity_structures()
    Structure.includes(lessons: [pages: [:activities]]).all.order(:id).map do |structure|

      { structure_id: structure.id,
        structure_name: structure.name,
        lessons: structure_lessons(structure) }
    end
  end

  def structure_lessons(structure)
    structure.lessons.order(:number).map do |lesson|
      next unless CourseLesson.where(lesson_id: lesson.id, course_id: 1).count #hack for now
      { lesson_id: lesson.id,
        lesson_title: lesson.title,
        lesson_number: lesson.number,
        lesson_published: lesson.published,
        pages: lesson_pages(lesson)
      }
    end
  end

  def lesson_pages(lesson)
    pages = lesson.pages.order(:position)
    pages = [Page.new] if pages.blank?
    pages.map do |page|
      activities = page.activities.order(:position)
      activities = [Activity.new] if activities.blank?
      { page_id: page.id,
        activities: activities.map { |act| { id: act.id, position: act.position, activity_type: act.type, lesson_published: lesson.published } }
      }
    end
  end
end
