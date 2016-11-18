class ClassroomStudentResponseDataSerializer < ActiveModel::Serializer
  attributes :student_response_data

  def student_response_data
    students_in_classroom = Student.where(classroom_id: object)
    students_in_classroom.map do |student|
      {student_id: student.id,
       first_name: student.first_name,
       last_name: student.last_name,
       current_activity_id: student.current_activity_id,
       responses: student_responses(student),
       is_hybrid: student.is_hybrid?,
       is_english: student.is_english?,
       is_spanish: student.is_spanish?,
       locked_activities: student.student_locked_lessons.pluck(:activity_id)
      }
    end
  end

  private

  def student_responses(student)
    by_id = all_responses.where(user: student).group_by(&:activity_id)
    by_id.map do |id, responses|
      { activity_id: id,
        attempts: responses.count,
        has_passing_score: responses.inject(false) { |passing, e| passing || e.is_passing_score }
      }
    end
  end

  def all_responses
    @all_responses ||= Response.joins(:user).where('user.classroom_id' == object)
  end
end
