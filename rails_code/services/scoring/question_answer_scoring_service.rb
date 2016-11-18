class QuestionAnswerScoringService
  include ScoringServiceable

  def score
    @response.detail_score = 100
    @response.main_idea_score = 100

    score_attr = "signal_score"
    use_synonyms = true

    case @response.activity.category
    when "Signaling"
      @response.structure_score = 100
      use_synonyms = false # Do not consider synonyms for signaling words
    when "Main Idea"
      @response.structure_score = 100
    when "Structure"
      @response.signal_score = 100
      score_attr = "structure_score"
    end

    # NOTE: Assumes single question.
    expected_words = @activity.question.words
    provided_text = @response.answers.find_by(question: @activity.question).content.downcase

    correct = score_text(expected_words, provided_text, use_synonyms)

    @response.send("#{score_attr}=", score_percentage(correct, expected_words.size))
    @response
  end

  private

  def scoreable_categories
    Activity::CATEGORIES
  end
end
