class StudentProgressService
  attr_reader :student

  def initialize(student)
    @student = student
  end

  def move_to_next_published_lesson(current_lesson=nil)
    if @student.current_lesson.published == false
      current_lesson = @student.current_activity.page.lesson if current_lesson == nil
      lesson = Lesson.where(["number > ? and published = ?", current_lesson.number, true]).first
      @student.update(current_activity: lesson.pages.first.activities.first)
    end
  end

  def return_next_published_lesson(_lesson=nil)
    #return @student.current_lesson unless _lesson.present?
    return _lesson if _lesson.present? && _lesson.published?
    _lesson = Lesson.where(["number > ? and published = ?", student.current_lesson.number, true]).order(:number).first
    _lesson = Lesson.where(["number > ? and published = ?", student.current_lesson.number, true]).order(:number).second if(_lesson == student.current_lesson)
    _lesson
  end

  def move_forward(activity)
    return unless activity == student.current_activity

    if student.current_activity.last_in_lesson?
      just_completed_lesson = student.current_lesson
      recall_activities = just_completed_lesson.activities_with_category("Recall")

      if recall_activities.any?
        # If we find recall activities, average the main idea scores
        # from the student's "best" responses.
        average = average_recall_activity_scores(recall_activities)

        # Choose the next lesson based on this average.
        next_lesson = get_score_based_next_lesson(just_completed_lesson, average)
      else
        # Otherwise, use the default next lesson.
        next_lesson = just_completed_lesson.default_next_lesson
      end

      #skip lessons if not published.
      #may need updated
      next_lesson = return_next_published_lesson(next_lesson)
      OaLogger.info("User: #{student.id} is moving on to lesson id: #{next_lesson.id.inspect}")

      next_activity = next_lesson.activities.first
    else
      next_activity = student.current_activity.next_activity
    end

    student.update(current_activity: next_activity)
  end

  def reset_unassigned_student
    if @student.current_activity.nil?
      @student.responses.empty? ? activity = Lesson.third.activities.first : activity = @student.responses.last.activity
      @student.update(current_activity: activity)
    end
  end

  private

  def average_recall_activity_scores(activities)
    activities.inject(0) { |sum, a|
      last_response_to_activity = student.last_response_to_activity(a)
      last_response_to_activity.present? ? sum += last_response_to_activity.main_idea_score : sum
    } / activities.count
  end

  def get_score_based_next_lesson(lesson, score)
    if score < 25
      lesson.remedial_next_lesson
    elsif score < 50
      lesson.default_next_lesson
    else
      lesson.advanced_next_lesson
    end
  end
end
