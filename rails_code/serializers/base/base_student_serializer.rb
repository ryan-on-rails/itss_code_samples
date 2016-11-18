class BaseStudentSerializer < ActiveModel::Serializer
  attributes :first_name, :last_name, :username, :password, :lesson, :page_number

  def lesson
    object.current_lesson.title rescue nil
  end
  def page_number
    object.current_activity.page.position rescue nil
  end
  def password
    object.plain_pass
  end
end
