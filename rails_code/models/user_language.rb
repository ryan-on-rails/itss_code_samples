class UserLanguage < ActiveRecord::Base
  validates :user, presence: true
  validates :language, presence: true

  belongs_to :user
  belongs_to :language
end
