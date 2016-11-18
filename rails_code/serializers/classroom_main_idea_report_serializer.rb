class ClassroomMainIdeaReportSerializer < ActiveModel::Serializer
  attributes :report_data

  # For each student:
  # - student info
  # - All main idea question responses
  # - For each main idea question
  #   - Order by Structure, Lesson, Page, Question numbers
  #   - Give Structure, Lesson, Page, Question numbers
  #   - List number of tries
  #   - List scores for each try

  def report_data
    students.map do |student|
      student_info = StudentInfo.new(student)
      main_idea_responses = student_main_idea_responses(student)

      {
        student_info: student_info.to_hash,
        main_idea_questions: main_idea_tries(main_idea_responses),
      }
    end
  end

  def students
    @students ||= Student.where(classroom_id: object)
                         .includes(current_activity: {page: :lesson})
  end

  def all_main_idea_responses
    @all_main_idea_responses ||= Response
                               .includes(activity: {page: {lesson: :structure}})
                               .where("activities.category = 'Main Idea'")
                               .references(:activity)
                               .to_a
  end

  def student_main_idea_responses(student)
    # Memoize this calculation, since we're using it a bunch
    @student_responses ||= Hash.new do |h, key|
      h[key] = all_main_idea_responses.select{ |resp| resp['user_id'] == key }
    end
    @student_responses[student.id]
  end

  def main_idea_tries(main_idea_responses)
    groups = response_groups(main_idea_responses)
    groups.map do |position, responses|
      {
        question_location: position,
        num_tries: responses.count,
        main_idea_scores: responses.sort_by(&:attempt).map(&:main_idea_score)
      }
    end
  end

  private

  def response_groups(main_idea_responses)
    main_idea_responses.group_by do |resp|
      {
        structure_id: resp.activity.page.lesson.structure_id,
        structure_name: resp.activity.page.lesson.structure.name,
        lesson_id: resp.activity.page.lesson_id,
        lesson_number: resp.activity.page.lesson.number,
        lesson_title: resp.activity.page.lesson.title,
        page_id: resp.activity.page_id,
        page_position: resp.activity.page.position,
        activity_id: resp.activity_id,
        activity_position: resp.activity.position,
      }
    end
  end
end
