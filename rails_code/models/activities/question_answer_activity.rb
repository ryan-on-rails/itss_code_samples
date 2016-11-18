##
# An activity wherein students answer a single question
# by typing an answer -- e.g., L17Q3
class QuestionAnswerActivity < Activity
  has_one :question, dependent: :destroy, foreign_key: :activity_id
end
