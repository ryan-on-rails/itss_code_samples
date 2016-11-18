class ClassroomGamingReportSerializer < ActiveModel::Serializer
  attributes :report_data

  def report_data
    students.map do |student|
      student_info = StudentInfo.new(student)
      responses = student.responses
      responses_contents = responses.map do |response|
        ResponseContent.from_response(response)
      end
      gaming_stats = GamingStats.new(responses_contents, profanity_regexes)

      {
        student_info: student_info.to_hash,
        gaming: {
          detected_num_questions: gaming_stats.detected_questions_count,
          detected_num_tries: gaming_stats.detected_tries.count,
          tries: {
            blank_num: gaming_stats.tries_blank.count,
            repeat_chars_num: gaming_stats.tries_repeat_chars.count,
            profanity_num: gaming_stats.tries_profanity.count
          }
        }
      }
    end
  end

  private

  def students
    @students ||= Student.where(classroom_id: object)
                         .includes(current_activity: {page: :lesson})
  end

  def all_responses
    @all_responses ||= ResponseContent.responses_with_answers(classroom_id: object).to_a
  end

  def profanity_regexes
    @profanity_regexes ||= Profanity.all.pluck(:regex_match).map do |regex_match|
      /#{regex_match}/
    end
  end

end
