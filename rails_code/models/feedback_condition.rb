##
# Represents a feedback condition for a student's response to
# a given activity. Associated feedback will be delivered
# if the condition is met.
class FeedbackCondition < ActiveRecord::Base
  validates :activity, presence: true
  validates :feedback, presence: true
  validates :attempt, presence: true, numericality: true

  acts_as_paranoid
  belongs_to :activity
  belongs_to :feedback

  # NOTE: feedback_level is a hold over from the old system.
  # Based on old code it seems to be a flag for the a feedback a user
  # gets (based on the ITSettings for that user). It seems like 1 is
  # normal, 0 is remedial.

  ##
  # Find the condition that most closely matches
  # the provided response.
  def self.get_for_response(response)
    conditions = where("activity_id = ? AND signal_score <= ? AND structure_score "\
          "<= ? AND main_idea_score <=? AND detail_score <= ? AND attempt = ? AND feedback_level = ?",
          response.activity_id,
          response.signal_score,
          response.structure_score,
          response.main_idea_score,
          response.detail_score,
          response.attempt,
          1
          )

    case response.activity.category
    when "Signaling"
      conditions.order(signal_score: :desc,
                      main_idea_score: :desc,
                      structure_score: :desc,
                      detail_score: :desc).first
    when "Structure"
      conditions.order(structure_score: :desc,
                      main_idea_score: :desc,
                      signal_score: :desc,
                      detail_score: :desc).first
    else
      #"Recall", "Writing", "Main Idea"
      conditions.order(main_idea_score: :desc,
                      structure_score: :desc,
                      signal_score: :desc,
                      detail_score: :desc).first
    end
  end
end
