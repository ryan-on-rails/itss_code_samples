class FillInBlankResponseFactory
  include ResponseFactoryable

  def build
    @data["answers"].each do |a|
      @response.fill_in_blank_answers.create(
        fill_in_blank_field_id: a["fill_in_blank_field_id"],
        content: a["content"]
      )
    end

    @response
  end
end
