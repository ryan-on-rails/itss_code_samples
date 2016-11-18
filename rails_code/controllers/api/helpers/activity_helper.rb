module ActivityHelper
  def save_activity(_activity, page_id)
    model = _activity.type.constantize
    monologues = _activity.delete("monologues")
    activity = model.find_or_initialize_by(id: _activity.id)
    language = Language.find_by(name: "english") #Todo, add a way to change language
    language_id = language.present? ? language.id : 1 #Todo, add a way to change language

    instructions = _activity.delete("instructions") || ""
    page_id = _activity.delete("page_id") || page_id

    case _activity.type

    when "InfoActivity"
      category = _activity.delete("category") || "Info"
      activity.update(type: "InfoActivity", instructions: instructions, category: category, page_id: page_id)

    when "MatrixActivity"
      category = _activity.delete("category") || "Signaling"
      rows = _activity.delete("matrix_rows") || []
      cols = _activity.delete("matrix_columns") || []
      _activity.delete("matrix_questions")
      activity.update(type: "MatrixActivity", instructions: instructions, category: category, page_id: page_id)

      #columns
      old_col_ids = MatrixColumn.where(activity_id: activity.id).pluck(:id) || []
      new_col_ids = []
      cols.each_with_index do |_col, col_index|
        col = MatrixColumn.find_or_initialize_by(id: _col.id)
        label = _col.delete("label")
        label = "Column #{(col_index+1)}" unless label.present?
        col.update(label: label, activity_id: activity.id)
        activity.matrix_columns << col if !activity.matrix_columns.index(col)
        new_col_ids.push(col.id)
      end
      delete_ids = old_col_ids - new_col_ids
      MatrixColumn.where(id: delete_ids).destroy_all

      #rows
      old_row_ids = MatrixRow.where(activity_id: activity.id).pluck(:id) || []
      new_row_ids = []
      rows.each_with_index do |_row, row_index|
        row = MatrixRow.find_or_initialize_by(id: _row.id)
        questions = _row.delete("matrix_questions")
        label = _row.delete("label")
        label = "Row #{(row_index+1)}" unless label.present?
        row.update(label: label, activity_id: activity.id)
        activity.matrix_rows << row if !activity.matrix_rows.index(row)
        new_row_ids.push(row.id)

        questions.each_with_index do |_question, index|
          question = MatrixQuestion.find_or_initialize_by(id: _question.id)
          row_id = _question.delete("matrix_row_id") || row.id
          col_id = _question.delete("matrix_column_id") || activity.matrix_columns[index].id
          populate = _question.delete("populate") || false
          question.update(matrix_row_id: row_id, matrix_column_id: col_id, populate: populate)

          #Adding/removing words
          words = _question.delete("words_string").split(",").compact || []
          self.update_words(question, words, nil, language_id)
        end
      end
      delete_ids = old_row_ids - new_row_ids
      MatrixRow.where(id: delete_ids).destroy_all

    when "QuestionAnswerActivity"
      category = _activity.delete("category") || "Structure"
      _question = _activity.delete("question")
      activity.update(type: "QuestionAnswerActivity", instructions: instructions, category: category, page_id: page_id)
      question = Question.find_or_initialize_by(id: _question.id)
      content = _question.delete("content") || ""
      question.update(activity_id: activity.id, content: content)
      words = _question.delete("words_string").split(",").compact || []
      self.update_words(question, words, nil, language_id)

    when "CompositionActivity"
      category = _activity.delete("category") || "Recall"
      _questions = _activity.delete("questions")
      activity.update(type: "CompositionActivity", instructions: instructions, category: category, page_id: page_id)
      _questions.each do |_question|

        question = Question.find_or_initialize_by(id: _question.id)
        content = _question.delete("content") || ""
        detail_words = (_question.delete("detail_words_string") || "").split(",").compact
        main_idea_words = (_question.delete("main_idea_words_string") || "").split(",").compact
        signaling_words = (_question.delete("signaling_words_string") || "").split(",").compact
        question.update(activity_id: activity.id, content: content)

        #Adding/removing words
        self.update_words(question, detail_words, "Detail", language_id)
        self.update_words(question, main_idea_words, "MainIdea", language_id)
        self.update_words(question, signaling_words, "Signaling", language_id)
      end

    when "FindAndClickActivity"
      category = _activity.delete("category") || "Signaling"
      _question = _activity.delete("question")
      activity.update(type: "FindAndClickActivity", instructions: instructions, category: category, page_id: page_id)
      question = FindAndClickQuestion.find_or_initialize_by(id: _question.id)
      content = _question.delete("content") || ""
      question.update(activity_id: activity.id, content: content)
      words = _question.delete("words_string").split(",").compact || []
      self.update_words(question, words, nil, language_id)

    when "FillInBlankActivity"
      category = _activity.delete("category") || "Main Idea"
      _question = _activity.delete("question")
      activity.update(type: "FillInBlankActivity", instructions: instructions, category: category, page_id: page_id)
      question = Question.find_or_initialize_by(id: _question.id)
      content = _question.delete("content") || ""
      fields = _question.delete("fill_in_blank_fields") || []
      fields.each do |field|
        _field = FillInBlankField.find_or_initialize_by(id: field.id)
        _field.update(question_id: question.id, position: field.position)
        words = field.delete("words") || []
        self.update_field_words(_field, words, language_id)
        question.fill_in_blank_fields << _field
      end
      question.update(activity_id: activity.id, content: content)

    when "MultipleChoiceActivity"
      category = _activity.delete("category") || "Signaling"
      _question = _activity.delete("question")
      activity.update(type: "MultipleChoiceActivity", instructions: instructions, category: category, page_id: page_id)
      question = MultipleChoiceQuestion.find_or_initialize_by(id: _question.id)
      content = _question.delete("content") || ""
      options = _question.delete("options")
      question.update(activity_id: activity.id, content: content)
      self.update_options(question, options)

    when "TreeActivity"
      category = _activity.delete("category") || "Signaling"
      activity.update(type: "TreeActivity", instructions: instructions, category: category, page_id: page_id)
      root_nodes = _activity.delete("root_nodes")
      self.update_tree_nodes(root_nodes[0], activity.id, language_id)

    else
      nil
    end
    activity.id
  end

  def update_words(question, words, _wordtype=nil, language_id=1)
    old_word_ids = question.words.pluck(:id) || []
    new_word_ids = []
    wordtype = "Questions#{_wordtype}Word"

    #override ids if type, other wise it deleted words from other types
    old_word_ids = QuestionsWord.where(type: wordtype, question: question).includes(:word).map(&:word).compact.map(&:id) if _wordtype.present?

    words.each do |_word|
      word = Word.find_or_create_by(content: _word.strip, language_id: language_id)
      if _wordtype.present?
        QuestionsWord.find_or_create_by(question: question, word: word, type: wordtype)
      else
        question.words << word if !question.words.index(word)
      end
      new_word_ids.push(word.id)
    end

    delete_ids = old_word_ids - new_word_ids
    question.words.delete(Word.where(id: delete_ids))
  end

  def update_field_words(field, words, language_id=1)
    words.each do |w|
      _word = Word.find_or_create_by(content: w.content, language_id: language_id)
      field.words << _word if !field.words.index(_word)
    end
  end

  def update_options(question, options)
    old_ids = MultipleChoiceOption.where(multiple_choice_question_id: question.id).pluck(:id) || []
    new_ids = []
    options.each do |o|
      _option = MultipleChoiceOption.find_or_create_by(multiple_choice_question_id: question.id, id: o.id)
      _option.update(label: o.label, correct: o.correct)
      new_ids.push(_option.id)
      question.options << _option if !question.options.index(_option)
    end
    delete_ids = old_ids - new_ids
    MultipleChoiceOption.where(id: delete_ids).destroy_all
  end

  def update_tree_nodes(root, activity_id, language_id=1)
    l2 = root.delete("child_nodes")
    _root = TreeNode.find_or_create_by(en_content: root.en_content, activity_id: activity_id)

    l2.each do |l2_node|
      l2_children = l2_node.delete("child_nodes")
      _l2n = TreeNode.find_or_create_by(en_content: l2_node.en_content)
      _root.child_nodes << _l2n if !_root.child_nodes.index(_l2n)

      l2_children.each do |l3_node|
        question = l3_node.delete("tree_question")
        _l3n = TreeNode.create(en_content: l3_node.en_content)
        _l2n.child_nodes << _l3n if !_l2n.child_nodes.index(_l3n)
        _question = TreeQuestion.find_or_create_by(label: question.label, tree_node_id: _l3n.id)
        _l3n.update(tree_question: _question)

        question.words.each do |w|
          _word = Word.find_or_create_by(content: w.content, language_id: language_id)
          _question.words << _word if !_question.words.index(_word)
        end
      end
    end
  end

end
