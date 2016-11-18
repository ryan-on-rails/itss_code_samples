##
# An activity wherein students select one of multiple 
# available answers -- e.g., L9Q6@54
class MultipleChoiceActivity < Activity
  has_one :multiple_choice_question, dependent: :destroy, foreign_key: :activity_id
  alias_method :question, :multiple_choice_question
end
