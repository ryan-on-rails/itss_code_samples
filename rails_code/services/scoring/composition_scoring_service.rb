class CompositionScoringService
  include ScoringServiceable

  def score
    expected_signaling_words_count, expected_main_idea_words_count,
      expected_detail_words_count = Array.new(3, 0)
    signaling_words_count, main_idea_words_count,
      detail_words_count = Array.new(3, 0)

    @activity.questions.each do |question|
      provided_text = @response.answers.find_by(question_id: question.id).content
      expected_signaling_words = question.signaling_words
      expected_main_idea_words = question.main_idea_words
      expected_detail_words = question.detail_words

      expected_signaling_words_count += expected_signaling_words.size
      expected_main_idea_words_count += expected_main_idea_words.size
      expected_detail_words_count += expected_detail_words.size

      signaling_words_count += score_text(expected_signaling_words, provided_text)
      main_idea_words_count += score_text(expected_main_idea_words, provided_text)
      detail_words_count += score_text(expected_detail_words, provided_text)
    end

    # Unique scoring logic for activities w/ 'Writing' category
    if @activity.category == "Writing"
      @response.detail_score = 100

      # NOTE: Pulled from WritingScorer in old codebase...
      signaling_words_max = 2
      main_idea_words_max = 3
      structure_words_max = 25

      # TODO: To get a "100%" accurate count of words provided -
      # words matched, we should just remove all matched expected words/phrases
      # from the concatenated answers (content) and then split on /\s+/.
      provided_words_count = @response.answers.pluck(:content).map { |c|
        c.split(/\s+/).size
      }.inject(:+) || 0

      structure_words_count = provided_words_count -
        (signaling_words_count + main_idea_words_count)

      @response.signal_score = score_percentage(signaling_words_count, signaling_words_max)
      @response.main_idea_score = score_percentage(main_idea_words_count, main_idea_words_max)
      @response.structure_score = score_percentage(structure_words_count, structure_words_max)
    else
      @response.structure_score = 100
      @response.signal_score = score_percentage(signaling_words_count, expected_signaling_words_count)
      @response.main_idea_score = score_percentage(main_idea_words_count, expected_main_idea_words_count)
      @response.detail_score = score_percentage(detail_words_count, expected_detail_words_count)
    end

    @response
  end

  private

  def scoreable_categories
    ["Main Idea", "Recall", "Writing"]
  end
end
