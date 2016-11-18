class CompositionResponseFactory
  include ResponseFactoryable

  def build
    @data["answers"].each do |a|
      @response.answers.create(question_id: a["question_id"], content: a["content"])
    end

    @response
  end
end