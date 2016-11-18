class ImportFromAdminService

  def initialize()
  end

  def import_students_for_classroom(classroom_id)
    students = []
    ActiveRecord::Base.establish_connection(DMZ_CONF).tap do
      #classroom = Classroom.find(classroom_id)
      Student.with_deleted.where(classroom_id: classroom_id).each {|s| students.push(s.dup)}
    end
    update_students(students)
  end
  def update_students(students)

    ActiveRecord::Base.establish_connection(LOCAL_DB_CONF).tap do

      course = Course.includes(:lessons).find_by(name: "Regular Lessons")
      first_activity_id = course.lessons.where(published: true).order(:number).limit(1).first.pages.first.activities.first.id

      students.each do |student|
        _student = Student.with_deleted.find_or_initialize_by( username: student.username.strip)
        _student.first_name = student.first_name.strip
        _student.last_name = student.last_name.strip
        _student.password = student.plain_pass.strip
        _student.classroom_id = student.classroom_id
        _student.current_activity_id = first_activity_id if _student.current_activity_id.blank?
        _student.writing_ability = student.writing_ability
        _student.learning_disability = student.learning_disability
        _student.deleted_at = student.deleted_at
        _student.save
      end 
    end
  end

  private

 
end
