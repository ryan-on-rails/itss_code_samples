##
# Represents the association between an activity and
# a word/phrase of a specific classification (type).
#
# NOTE: [DEPRECATED] There is not a clear use for this
# model at this time; keeping it here for the sake of running
# old imports. Words should be associated w/ specific questions,
# rather than the parent activity. This allows us to be more
# granular w/ our scoring.
#
# There exists the potential to use ArticleWords (if available) to make
# suggestions for ActivityWords.
class ActivityWord < ActiveRecord::Base
  validates :activity, presence: true
  validates :word, presence: true
  validates :type, presence: true

  belongs_to :activity
  belongs_to :word
end
