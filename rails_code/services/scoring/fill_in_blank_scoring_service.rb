class FillInBlankScoringService
  include ScoringServiceable

  def score
    field_scores = []
    @response.detail_score = 100
    @response.main_idea_score = 100

    score_attr = "signal_score"
    use_synonyms = true

    case @activity.category
    when "Main Idea"
      @response.structure_score = 100
    when "Signaling"
      use_synonyms = false
      @response.structure_score = 100
    when "Structure"
      @response.signal_score = 100
      score_attr = "structure_score"
    end

    # Grade each field individually
    @activity.question.fill_in_blank_fields.each do |field|
      answer = @response.fill_in_blank_answers.find_by(fill_in_blank_field: field)
      correct_count = score_text(field.words, answer.content, use_synonyms)
      field_scores << score_percentage(correct_count, field.words.size)
    end

    @response.send("#{score_attr}=", score_average(field_scores))
    @response
  end

  private

  def scoreable_categories
    Activity::CATEGORIES
  end
end
