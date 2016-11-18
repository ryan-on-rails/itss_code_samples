class TreeResponseFactory
  include ResponseFactoryable

  def build
    @data["answers"].each do |a|
      @response.tree_answers.create(
        tree_question_id: a["tree_question_id"],
        content: a["content"]
      )
    end

    @response
  end
end