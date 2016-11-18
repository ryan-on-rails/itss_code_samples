##
# Represents a task (to fill in blank fields)
# within a FillInBlankActivity.
class FillInBlankQuestion < ActiveRecord::Base
  include Wordsable
  acts_as_paranoid

  validates :content, presence: true
  validates :activity, presence: true

  belongs_to :activity
end
