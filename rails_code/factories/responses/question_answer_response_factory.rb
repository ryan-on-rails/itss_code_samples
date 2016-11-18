class QuestionAnswerResponseFactory
  include ResponseFactoryable

  def build
    @response.answers.create(
      question_id: @data["answer"]["question_id"],
      content: @data["answer"]["content"]
    )

    @response
  end
end