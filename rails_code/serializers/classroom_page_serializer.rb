class ClassroomPageSerializer < ActiveModel::Serializer
  attributes :id, :position, :lesson_id

  has_many :activities, serializer: ClassroomActivitySerializer

end
