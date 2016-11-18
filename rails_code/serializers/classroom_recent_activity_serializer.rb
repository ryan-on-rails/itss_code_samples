class ClassroomRecentActivitySerializer < ActiveModel::Serializer
  attributes :report_data

  def report_data
    data = Student.where(classroom_id: object).map do |student|
      responses = student.responses.order(created_at: :desc).map{|r|  r.activity.type != "InfoActivity" ? r : nil}.compact
      next if responses.count <= 0
      activity = responses.first.activity
      responses = responses.select {|r| r.activity_id == activity.id}
      responses_contents = responses.map do |r|
        ResponseContent.from_response(r)
      end

      article = activity.article
      current_title = student.current_lesson.title rescue nil
      { activity: { category: activity.category,
                    type: activity.type,
                    instructions: activity.question_description,
                    article_title: article.present? ? article.en_title : "",
                    article_body: article.present? ? article.en_body : "",
                    attempts: responses_contents.count },
        student_info: { first_name: student.first_name,
                        last_name: student.last_name,
                        username: student.username,
                        password: student.plain_pass,
                        lesson: current_title,
                        page_number: current_page_number(student) },
        model_response: activity.model_response,
        responses: responses_contents.reverse
      }
    end
    data.compact
  end

  private

  def current_page_number(student)
    student.current_activity.page.position rescue nil
  end
end
