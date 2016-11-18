class FillInBlankAnswer < ActiveRecord::Base
  validates :response, presence: true
  validates :fill_in_blank_field, presence: true

  belongs_to :response
  belongs_to :fill_in_blank_field
end
