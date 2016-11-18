class District < ActiveRecord::Base
  establish_connection DMZ_CONF
  has_paper_trail

  validates :name, presence: true
  validates :nces_id, presence: true
  validates :state_id, presence: true

  has_many :schools, dependent: :destroy
end
