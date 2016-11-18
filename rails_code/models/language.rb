class Language < ActiveRecord::Base
  has_many :student_languages
  has_many :students, through: :student_languages
end
