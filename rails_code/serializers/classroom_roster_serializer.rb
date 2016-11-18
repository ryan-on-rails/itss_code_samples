class ClassroomRosterSerializer < ActiveModel::Serializer
  attributes :roster

  def roster
    # username, password, lesson, page number
    students = Student.where(classroom_id: object).includes(current_activity: {page: :lesson})
    students.map do |student|
      student_lesson_title = student.current_lesson.title rescue nil
      { first_name: student.first_name,
        last_name: student.last_name,
        username: student.username,
        password: student.plain_pass,
        lesson: student_lesson_title,
        page_number: current_page_number(student)
      }
    end
  end

  private

  def current_page_number(student)
    student.current_activity.page.position rescue nil
  end
end
