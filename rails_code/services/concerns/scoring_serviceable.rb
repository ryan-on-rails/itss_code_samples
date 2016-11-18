module ScoringServiceable
  extend ActiveSupport::Concern

  MAX_SCORE = 100
  MIN_SCORE = 0

  def initialize(response)
    unless response.is_a?(Response) && response.activity
      raise ArgumentError, "Please provide a #<Response> with an "\
        "associated #<Activity>!"
    end

    @response = response
    @activity = response.activity.freeze
    @article_words = ["the","a","an","this","to","you","is","of","in","is","and","it","what","i","for","that","how","are","your","on","with","these","was","from","when"]


    cannot_score_activity! unless can_score_category?
  end

  protected

  def score_percentage(num, den)
    return MAX_SCORE if den.zero?
    score = (num / den.to_f) * 100
    [[score, MAX_SCORE].min, MIN_SCORE].max # Clamp
  end

  def score_average(scores)
    return 0 if scores.size.zero?
    scores.inject(0) { |t, s| t + s} / scores.size
  end

  def score_text(expected_words, text, use_synonyms = true)
    # First pass: Check basic word inclusion.
    correct, missed_words = score_text_basic(expected_words, text)

    # Second pass: If student did not match all of the expected words,
    # check misspellings and synonyms.
    if correct < expected_words.size
      correct += score_text_advanced(missed_words, text, use_synonyms)
    end

    correct
  end

  private

  def can_score_category?
    scoreable_categories.include?(@response.activity.category)
  end

  def cannot_score_activity!
    raise CategoryMismatchError, "Bad category; cannot score activity: "\
      "#{@response.activity.attributes}!"
  end

  def scoreable_categories
    raise NotImplementedError, "ScoringServices must explicitly "\
      "indicate which categories are scoreable!"
  end

  def score_text_basic(expected_words, text)
    missed_words = []  # Keep track of words that aren't matched
    correct = 0
    expected_words.each do |word|
      words_content = word.content.downcase.gsub(/\b(#{@article_words.join("|")})\b/i, "")
      words_content = words_content.gsub(/\b(  )\b/i, " ").split(" ")

      words_content.each_with_index do |word_content, index|
        if !text.downcase.match(/\b#{Regexp.escape(word_content.downcase)}\b/i)
          missed_words << word
        elsif index == (words_content.count-1)
          correct += 1
        else
          next
        end
      end

    end

    [correct, missed_words]
  end

  # Score with consideration for word synonyms (if applicable)
  # and misspellings.
  def score_text_advanced(missed_words, text, use_synonyms)
    correct = 0
    search_words = []
    missed_words.each do |word|
      obj = {missed_word: word.content, synonyms: [],  misspelled_words: []}

      #gather synonym words
      obj[:synonyms] = word.synonyms.map { |s| s.content.downcase }  if use_synonyms

      #gather misspelled words
      obj[:misspelled_words] = word.misspellings.map { |m| m.content.downcase }

      search_words.push(obj)
    end

    search_words.each do |word_obj|
      word_found = false
      #check synonyms first
      word_obj[:synonyms].each do |synonym|
        if text.downcase.match(/\b#{Regexp.escape(synonym.downcase)}\b/i)
          correct += 1
          word_found = true
          break
        end
      end

      #if the synonym was found, no need to check misspellings
      next if word_found == true

      #check misspellings
      word_obj[:misspelled_words].each do |misspelled_word|
        if text.downcase.match(/\b#{Regexp.escape(misspelled_word.downcase)}\b/i)
          correct += 1
          word_found = true
          break
        end
      end
    end

    correct
  end

  class CategoryMismatchError < StandardError; end
end
