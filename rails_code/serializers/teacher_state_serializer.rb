class TeacherStateSerializer < ActiveModel::Serializer
  attributes :user

  def user
    UserSerializer.new(object, scope: object)
  end
end
