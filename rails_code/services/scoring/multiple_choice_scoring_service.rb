class MultipleChoiceScoringService
  include ScoringServiceable

  def score
    @response.detail_score = MAX_SCORE
    @response.main_idea_score = MAX_SCORE

    score_attr = case @activity.category
    when "Signaling", "Main Idea"
      @response.structure_score = MAX_SCORE
      "signal_score"
    when "Structure"
      @response.signal_score = MAX_SCORE
      "structure_score"
    end

    student_score = 0
    expected_count = @activity.multiple_choice_question.correct_options.size

    # Reward for correctness; punish for incorrectness
    @response.multiple_choice_answers.each do |answer|
      student_score += answer.correct? ? 1 : -1
    end

    student_score = MIN_SCORE if student_score < MIN_SCORE
    @response.send("#{score_attr}=", score_percentage(student_score, expected_count))
    @response
  end

  private

  def scoreable_categories
    ["Signaling", "Main Idea", "Structure"]
  end
end
