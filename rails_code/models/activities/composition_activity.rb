##
# An activity wherein students provide a written
# response (generally of paragraph length) -- e.g., L33Q1
class CompositionActivity < Activity
  has_many :questions, dependent: :destroy, foreign_key: :activity_id
end
