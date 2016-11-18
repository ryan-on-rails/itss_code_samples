class StudentResponseDataSerializer < ActiveModel::Serializer
  attributes :student_id , :first_name, :last_name, :current_activity_id, :responses, :is_hybrid,
   :is_english, :is_spanish, :locked_activities 

  def student_id
    object.id
  end
  def is_hybrid
    object.is_hybrid?
  end
  def is_english
    object.is_english?
  end
  def is_spanish
    object.is_spanish?
  end
  def responses
    student_responses(object)
  end
  def locked_activities
    object.student_locked_lessons.pluck(:activity_id)
  end

  private

  def student_responses(student)
    by_id = student.responses.group_by(&:activity_id)
    by_id.map do |id, responses|
      { activity_id: id,
        attempts: responses.count,
        has_passing_score: responses.inject(false) { |passing, e| passing || e.is_passing_score }
      }
    end
  end

end
