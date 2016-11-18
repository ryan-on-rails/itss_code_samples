class FindAndClickResponseFactory
  include ResponseFactoryable

  def build
    answer = @response.create_find_and_click_answer(
      find_and_click_question_id: @data["answer"]["question_id"]
    )

    @data["answer"]["words"].each do |w|
      words = Word.where('lower(content) = ?', w.downcase)
      word = words.find_by(content: w) || words.first
      answer.words << word if word
    end

    @response
  end
end