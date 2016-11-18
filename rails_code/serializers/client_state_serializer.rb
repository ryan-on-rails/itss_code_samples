# Serialize initial state for client
class ClientStateSerializer < ActiveModel::Serializer
  attributes :lesson, :course_list, :lesson_list, :user, :page, :activity, :progress

  # Current lesson
  def lesson
    _lesson = object.is_a?(Student) ?  object.current_lesson : Lesson.where(published: true).first
    LessonSerializer.new(_lesson, scope: object)
  end

  # Lesson list
  def lesson_list
    if object.admin?
      Lesson.where(published: true).all.order(:number).map { |l|
        BaseLessonSerializer.new(l, scope: object)
      }
    else
      []
    end
  end

  # Course list
  def course_list
    if object.admin?
      Course.all.order(:id).map { |c|
        BaseCourseSerializer.new(c, scope: object)
      }
    else
      []
    end
  end

  def user
    UserSerializer.new(object, scope: object)
  end

  def page
    page = Page.includes(:content_elements).find(object.current_activity.page_id)
    PageSerializer.new(page, scope: object)
  end

  # Current activity
  def activity
    # activity = object.current_activity
    # "#{activity.type}Serializer".constantize.new(activity, scope: object)
  end

  def progress
    current_lesson = object.current_lesson
    activities = current_lesson.activities

    # We only want to collect one lesson (unless multiple
    # have been started) for each lesson number in the course,
    # thus we group by lesson number and prefer the lesson that
    # has been started (if available). Otherwise, we default
    # to the first of the grouped lessons.
    lessons = object.course.present? ? object.course.lessons.
      where(structure: current_lesson.structure, published: true).
      group_by(&:number).
      each_with_object([]) { |grouped, o|
        _, lssns = grouped

        started = lssns.select { |l|
          object.has_started_lesson?(l)
        }

        plssns = started.any? ? started : [lssns.first]
        o.push(*plssns)
      } : []

    {
      total_lessons: lessons.count,
      current_lesson: lessons.index(current_lesson) + 1,
      total_activities: activities.count,
      current_activity: activities.index(object.current_activity) + 1,
      lessons: lessons.map { |l|
        {
          id: l.id,
          title: l.title,
          percentage: object.progress_for_lesson(l),
          is_current_lesson: (l.id == current_lesson.id)
        }
      }
    }
  end
end
