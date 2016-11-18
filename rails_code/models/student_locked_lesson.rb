class StudentLockedLesson < ActiveRecord::Base
  validates :user, presence: true
  validates :activity, presence: true

  belongs_to :user
  belongs_to :activity
end
