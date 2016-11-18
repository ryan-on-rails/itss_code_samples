##
# Represents a teacher
class Teacher < User
  belongs_to :classroom


  ##
  # Serialize the teacher information needed for the dashboard
  def serialize!
    TeacherStateSerializer.new(self)
  end

  ##
  # Can the user actually use the application
  def is_supported?
    true
  end

  ##
  # Returns the type of the user, in this case teacher
  def type_string
    "Teacher"
  end

  ##
  # Returns if this user has access to WeWrite
  def wewrite_access?
    return self.classroom.wewrite_access
  end

  ##
  # Returns if this user has access to ITSS
  def itss_access?
    return self.classroom.itss_access
  end

  ##
  # What is the default route that this type of user should be
  # redirected to on login
  def application_root
    '/dashboard'
  end

  def import_students
    ImportFromAdminService.new.import_students_for_classroom(current_user.classroom_id)
  end
  def after_database_authentication
    ImportFromAdminService.new.import_students_for_classroom(current_user.classroom_id)
  end
end
