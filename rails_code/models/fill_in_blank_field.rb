##
# Represents a blank field in a fill-in-the-blank question.
class FillInBlankField < ActiveRecord::Base
  include Orderable

  validates :question, presence: true

  belongs_to :question
  has_many :fill_in_blank_fields_words
  has_many :words, through: :fill_in_blank_fields_words

  def orderables
    self.class.where(question: question)
  end
end
