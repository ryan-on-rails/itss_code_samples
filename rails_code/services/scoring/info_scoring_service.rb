class InfoScoringService
  include ScoringServiceable

  def score
    @response
  end

  private

  def scoreable_categories
    ["Info"]
  end
end
