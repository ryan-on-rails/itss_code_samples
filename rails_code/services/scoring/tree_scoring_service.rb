class TreeScoringService
  include ScoringServiceable

  def score
    @response.detail_score = 100
    @response.main_idea_score = 100
    score_attr = "signal_score"
    @use_synonyms = true

    case @response.activity.category
    when "Signaling"
      @response.structure_score = 100
      @use_synonyms = false
    when "Main Idea"
      @response.structure_score = 100
    when "Structure"
      @response.signal_score = 100
      score_attr = "structure_score"
    end

    # NOTE: Assume that a TreeActivity can have multiple questions.
    @score, @expected_words_count = 0, 0
    @activity.all_nodes.each do |node|
      score_node(node)
    end

    @response.send("#{score_attr}=", score_percentage(@score, @expected_words_count))
    @response
  end

  private

  def score_node(node)
    if node.question?
      expected_words = node.tree_question.words
      answer = @response.tree_answers.find_by(tree_question_id: node.tree_question.id)
      provided_text = answer.content.downcase

      @score += score_text(expected_words, provided_text, @use_synonyms)
      @expected_words_count += expected_words.size
    end
  end

  def scoreable_categories
    Activity::CATEGORIES
  end
end
