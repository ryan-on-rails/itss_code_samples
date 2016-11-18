class MatrixScoringService
  include ScoringServiceable

  def score
    @response.main_idea_score = MAX_SCORE
    @response.detail_score = MAX_SCORE
    @response.structure_score = MAX_SCORE

    # Create stores for expected and correct word counts
    expected_count = @activity.matrix_questions.flat_map(&:words).count
    correct_count = 0

    # For each matrix question, check its expected words against the
    # words provided for the corresponding matrix answer in the response.
    # Intersect expected words and answer words and size up the resultant
    # overlap array. This count represents the amount correct.
    missing_words = []
    @activity.matrix_questions.each do |mq|
      if answers = @response.matrix_answers.where(matrix_question: mq)
        answers.each do |answer|
          correct_count += (mq.words.pluck(:content) & answer.words.pluck(:content)).size
        end
      end
    end
    _words = missing_words.map{|w|w.content}
    @response.signal_score = score_percentage(correct_count, expected_count)
    @response
  end

  private

  def scoreable_categories
    Activity::CATEGORIES
  end
end
