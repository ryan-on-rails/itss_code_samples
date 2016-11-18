class ScoringService
  def initialize(response)
    @response = response
  end

  ##
  # Grades a response by assigning signal_score, structure_score,
  # main_idea_score, and detail_score, and then passing or failing.
  # Returns modified response.
  def score
    @response = scoring_service.new(@response).score
    pass_or_fail!
    @response.save
    @response
  end

  private

  def pass_or_fail!
    @response.is_passing_score =
      (@response.activity.autopass? ? true : is_passing_score?)
  end

  def is_passing_score?
    case @response.activity.category
    when "Main Idea" then @response.signal_score > 50 && @response.main_idea_score > 50 && @response.detail_score > 50
    when "Recall" then  @response.signal_score > 50 && @response.main_idea_score > 50 && @response.detail_score > 35
    when "Signaling" then @response.signal_score == 100
    when "Structure" then @response.structure_score == 100
    when "Writing" then @response.signal_score > 5 && @response.main_idea_score > 50 && @response.detail_score > 50
    when "Info" then true
    end
  end

  # Scoring services should follow naming convention:
  # [Matrix]Activity -> [Matrix]ScoringService
  def scoring_service
    begin
      @response.activity.type.gsub("Activity", "ScoringService").constantize
    rescue
      raise NotImplementedError, "No ScoringService for #{@response.activity.type}"
    end
  end
end
