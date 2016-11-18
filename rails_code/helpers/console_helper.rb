module ConsoleHelper
  def set_activity(act_or_id)
    id = act_or_id.is_a?(Activity) ? act_or_id.id : act_or_id
    Student.first.update(current_activity_id: id)
  end

  def set_lesson(lsn_or_id)
    lesson = lsn_or_id.is_a?(Lesson) ? lsn_or_id : Lesson.find(lsn_or_id)
    Student.first.update(current_activity: lesson.activities.first)
  end

  def destroy_responses(act_id = nil)
    responses = act_id ? Response.where(activity_id: act_id) : Response.all
    responses.destroy_all
  end
end
