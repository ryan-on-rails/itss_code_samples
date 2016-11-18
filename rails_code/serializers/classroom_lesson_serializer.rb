class ClassroomLessonSerializer < ActiveModel::Serializer
  attributes :id, :title, :number, :description

  has_many :pages, serializer: ClassroomPageSerializer

end
