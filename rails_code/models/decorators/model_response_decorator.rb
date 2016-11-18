module ModelResponseDecorator
  # The content of a given response is spread out through a variety of
  # potential answer objects. This object encodes how to bring those
  # together.

  def model_response
    case type
    when 'InfoActivity'
      ['']
    when 'CompositionActivity'
      compositions_model
    when 'QuestionAnswerActivity'
      answers_model
    when 'FillInBlankActivity'
      fill_in_blank_model
    when 'FindAndClickActivity'
      find_and_click_model
    when 'MatrixActivity'
      matrix_model
    when 'MultipleChoiceActivity'
      multiple_choice_model
    when 'TreeActivity'
      tree_model
    end
  end

  private

  def compositions_model
    return [article.en_main_idea] if category == 'Main Idea'
    return [article.en_recall] if category == 'Recall'
    # fall-through (category 'Writing'?)
    questions.map { |question| question.words.map(&:content) }
  end

  def answers_model
    [question.words.map(&:content)]
  end

  def fill_in_blank_model
    question.fill_in_blank_fields.map do |field|
      field.words.map(&:content)
    end
  end

  def find_and_click_model
    [find_and_click_question.words.map(&:content)]
  end

  def matrix_model
    matrix_questions.map do |mq|
      mq.words.map(&:content)
    end
  end

  def multiple_choice_model
    question.options.select(&:correct?).map(&:label) if question.options
  end

  def tree_model
    all_nodes.select(&:question?).map do |node|
      node.tree_question.words.map(&:content)
    end
  end
end
