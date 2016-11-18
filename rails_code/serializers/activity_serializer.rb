class ActivitySerializer < ActiveModel::Serializer
  attributes :id, :type, :category, :position, :instructions,
    :next_activity_id, :last_on_page?, :first_in_lesson?, :active

  has_many :monologues

  def next_activity_id
    object.next_activity.try(:id)
  end

  # Indicates whether or not the client
  # should immediately begin the activity
  # animation.
  def active
    !object.first_in_lesson? ||
      object.page.lesson.monologues.empty?
  end
end
