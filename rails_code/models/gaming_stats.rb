class GamingStats
  attr_reader :responses_contents, :profanity_regexes

  def initialize(responses_contents, profanity_regexes)
    @responses_contents = responses_contents
    @profanity_regexes = profanity_regexes
  end

  def detected_questions_count
    Set.new(detected_tries.map{|t| t.activity_id}).count
  end

  def detected_tries
    tries_blank + tries_repeat_chars + tries_profanity
  end

  def tries_blank
    @tries_blank ||= responses_contents.select do |response_content|
      response_content.left_blank?
    end
  end

  def tries_repeat_chars
    @tries_repeat_chars ||= responses_contents.select do |response_content|
      five_or_more.match(response_content.content_string)
    end
  end

  def tries_profanity
    @tries_profanity ||= responses_contents.select do |response_content|
      profanity_regexes.any?{ |profanity| profanity.match(response_content.content_string) }
    end
  end

  private

  def five_or_more
    /(.)\1{4,}/
  end
end
