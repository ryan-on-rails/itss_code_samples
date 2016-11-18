class School < ActiveRecord::Base
  establish_connection DMZ_CONF
  has_paper_trail

  validates :name, presence: true
  validates :nces_id, presence: true
  validates :state_id, presence: true

  belongs_to :district
  has_many :classrooms, dependent: :destroy
end
