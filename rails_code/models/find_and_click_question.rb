##
# Represents a task (to find and click words)
# within a FindAndClickActivity.
class FindAndClickQuestion < ActiveRecord::Base
  include Wordsable
  acts_as_paranoid

  validates :content, presence: true
  validates :activity, presence: true

  belongs_to :activity
end
