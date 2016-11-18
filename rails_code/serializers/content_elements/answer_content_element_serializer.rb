class AnswerContentElementSerializer < ContentElementSerializer
  attributes :representation, :activity_type, :activity_category,
    :activity_id

  def representation
    return unless scope || object.activity.present?
    
    return if object.activity.type_slug == "Info"
    rep = if object.show_student_answer?
      object.get_answer_for_user(scope)
    else
      object.activity
    end

    return unless rep

    klass = "#{object.activity.type_slug}RepresentationSerializer".constantize
    klass.new(rep)
  end

  def activity_type
    return nil if object.activity.blank?
    object.activity.type
  end

  def activity_category
    return nil if object.activity.blank?
    object.activity.category
  end
end
