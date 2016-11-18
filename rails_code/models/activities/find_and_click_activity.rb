##
# An activity wherein students identify words
# by clicking them in the article/content -- e.g., L17Q1
class FindAndClickActivity < Activity
  has_one :find_and_click_question, dependent: :destroy, foreign_key: :activity_id
  alias_method :question, :find_and_click_question
end
