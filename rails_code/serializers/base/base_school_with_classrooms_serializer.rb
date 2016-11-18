class BaseSchoolWithClassroomsSerializer < ActiveModel::Serializer
  attributes :id, :name, :district_id, :state_id

  has_many :classrooms, serializer: BaseClassroomSerializer
end
