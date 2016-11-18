class FindAndClickScoringService
  include ScoringServiceable

  def score
    @response.detail_score = 100
    @response.main_idea_score = 100

    score_attr = case @activity.category
    when "Main Idea", "Signaling"
      @response.structure_score = 100
      "signal_score"
    when "Structure"
      @response.signal_score = 100
      "structure_score"
    end

    # Create stores for the expected and provided words, and
    # intersect these sets to find the number of correct words provided
    expected_words = @activity.find_and_click_question.words.map{|w| w.content.downcase }
    expected_count = expected_words.count
    provided_words = @response.find_and_click_answer.words.map{|w| w.content.downcase }

    # Cannot just use intersection here, as the question
    # may demand that the same word is provided twice.
    correct_count = provided_words.inject(0) { |s, w|
      if index = expected_words.index(w)
        expected_words.slice!(index)
        s + 1
      else
        s
      end
    }

    @response.send("#{score_attr}=", score_percentage(correct_count, expected_count))
    @response
  end

  private

  def scoreable_categories
    ["Main Idea", "Signaling", "Structure"]
  end
end
