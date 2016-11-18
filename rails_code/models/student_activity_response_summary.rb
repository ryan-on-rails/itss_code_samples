class StudentActivityResponseSummary
  attr_reader :user_id, :activity_id

  def initialize(user_id, activity_id)
    @user_id = user_id
    @activity_id = activity_id
  end

  def summarize
    { activity: { id: activity_id,
                  type: activity.type,
                  category: activity.category,
                  instructions: activity.question_description,
                  page: activity.page_id,
                  article_title: activity.article.en_title,
                  article_body: activity.article.en_body },
      student_info: { id: user_id,
                      username: student.username,
                      first_name: student.first_name,
                      last_name: student.last_name,
                      password: student.plain_pass },
      model_response: { attempt: 'model',
                        content: activity.model_response },
      responses: responses.map { |r| ResponseContent.from_response(r) }
    }
  end

  private

  def activity
    @activity ||= responses.first.activity || Activity.find(activity_id)
  end

  def student
    @student ||= responses.first.user || User.find(user_id)
  end

  def responses
    @responses ||= Response.where(user_id: user_id, activity_id: activity_id)
                           .includes(:user).includes(:activity)
  end
end
