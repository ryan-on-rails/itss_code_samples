class FillInBlankFieldsWord < ActiveRecord::Base
  belongs_to :word
  belongs_to :fill_in_blank_field
end
