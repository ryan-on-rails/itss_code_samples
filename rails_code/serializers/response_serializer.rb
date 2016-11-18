class ResponseSerializer < ActiveModel::Serializer
  attributes :id, :activity_id, :attempt, :structure_score, :signal_score,
    :detail_score, :main_idea_score, :passing_score

  has_many :answers
  has_many :matrix_answers
  has_many :tree_answers
  has_many :multiple_choice_answers
  has_many :fill_in_blank_answers
  has_one :find_and_click_answer

  # NOTE: Generally, prefer not to create methods
  # that are purely cosmetic.
  def passing_score
    object.is_passing_score?
  end
end