class MultipleChoiceResponseFactory
  include ResponseFactoryable

  def build
    @data["answers"].each do |a|
      @response.multiple_choice_answers.create(
        multiple_choice_option_id: a["multiple_choice_option_id"]
      )
    end

    @response
  end
end