module QuestionDescriptionDecorator
  def question_description
    case type
    when 'InfoActivity'
      info_description
    when 'CompositionActivity'
      basic_description
    when 'QuestionAnswerActivity'
      basic_description
    when 'FillInBlankActivity'
      fill_in_blank_description
    when 'FindAndClickActivity'
      basic_description
    when 'MatrixActivity'
      matrix_description
    when 'MultipleChoiceActivity'
      multiple_choice_description
    when 'TreeActivity'
      tree_description
    end
  end

  private

  def info_description
    { label: ["Click 'Continue' when you're finished reading."] }
  end

  def basic_description
    { label: [instructions] }
  end

  def fill_in_blank_description
    { label: [instructions,
              question.content.gsub(/@\(.\)/, '____')] }
  end

  def matrix_description
    { label:   [instructions],
      options: matrix_columns.map { |c| "#{c.label}: (#{matrix_rows.map(&:label).join(", ")})"}
    }
  end

  def multiple_choice_description
    { label:   [instructions,
                question.content],
      options: question.options.map(&:label) } if question.options
  end

  def tree_description
    # only goes two labels deep (won't show branches past the second level)
    { label:   [instructions],
      options: [root_nodes[0].en_content] + root_nodes[0].child_nodes
                                            .map { |n| "#{n.en_content}: (#{n.child_nodes.map{|cn| cn.en_content.chomp(' ')}.join(", ")})"}
    }
  end
end
