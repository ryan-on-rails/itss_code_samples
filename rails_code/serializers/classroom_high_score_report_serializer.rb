class ClassroomHighScoreReportSerializer < ActiveModel::Serializer
  attributes :report_data

  def report_data
    students.map do |student|
      student_info = StudentInfo.new(student)
      responses_contents = student_responses(student).map do |response|
        ResponseContent.from_response(response)
      end
      gaming_stats = GamingStats.new(responses_contents, profanity_regexes)

      {
        student_info: student_info.to_hash,
        questions: {
          total_completed: total_questions_completed(student),
          total_tries: total_tries(student),
          signaling: {
            completed: completed('Signaling', student),
            first_try_high: first_try_high('Signaling', student)
          },
          structure: {
            completed: completed('Structure', student),
            first_try_high: first_try_high('Structure', student)
          },
          main_idea: {
            completed: completed('Main Idea', student),
            first_try_high: first_try_high('Main Idea', student)
          },
          full_recall: {
            completed: completed('Recall', student),
            first_try_high: first_try_high('Recall', student)
          }
        },
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

  def student_responses(student)
    # Memoize this calculation, since we do it in like, 15 times per
    # student:
    @student_responses ||= Hash.new do |h, key|
      h[key] = all_responses.select{ |resp| resp['user_id'] == key }
    end
    @student_responses[student.id]
  end

  def total_questions_completed(student)
    student_responses(student).select{ |resp| resp['is_passing_score'] }.count
  end

  def total_tries(student)
    student_responses(student).count
  end

  def completed(category, student)
    completed = student_responses(student).select do |resp|
      resp.activity.category == category && resp['is_passing_score']
    end
    completed.count
  end

  def first_try_high(category, student)
    first_high = student_responses(student).select do |resp|
      resp.activity.category == category &&
        resp['is_passing_score'] &&
        resp['attempt'] == 1
    end
    first_high.count
  end
end
