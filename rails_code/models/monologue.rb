class Monologue < ActiveRecord::Base
  include Orderable
  include TTSable

  validates :en_text, presence: true
  validate :has_activity_or_lesson

  ##I feel like this should probably change to a many to many relation
  belongs_to :activity
  belongs_to :lesson

  def orderables
    activity ? activity.monologues : lesson.monologues
  end

  private

  def has_activity_or_lesson
    unless activity || lesson
      errors[:base] << "A monologue must have an activity or a lesson."
    end
  end
end
