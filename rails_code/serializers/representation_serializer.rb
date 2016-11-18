class RepresentationSerializer < ActiveModel::Serializer
  attributes :activity_type, :activity_category

  def activity_type
    activity.type
  end

  def activity_category
    activity.category
  end

  protected

  def activity
    case object
    when Response then object.activity
    when Activity then object
    else
      raise ArgumentError,
        "Cannot serialize object: #{object}!"
    end
  end
end
