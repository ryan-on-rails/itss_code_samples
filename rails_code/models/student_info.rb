class StudentInfo
  attr_reader :student

  def initialize(student)
    @student = student
  end

  def to_hash
    current_lesson_title = student.current_lesson.title rescue nil
    {
      first_name: student.first_name,
      last_name: student.last_name,
      username: student.username,
      password: student.plain_pass,
      lesson: current_lesson_title,
      page_number: current_page_number
    }
  end

  def current_page_number
    student.current_activity.page.position rescue nil
  end
end
