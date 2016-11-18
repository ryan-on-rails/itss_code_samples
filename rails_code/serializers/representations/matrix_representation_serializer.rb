class MatrixRepresentationSerializer < RepresentationSerializer
  attributes :answer

  def answer
    rows, cols = activity.matrix_rows, activity.matrix_columns
    rep = Array.new(rows.count + 1, Array.new(cols.count + 1, ""))

    rep[0] = [""] + cols.map(&:label)
    rows.count.times do |i|
      rep[i + 1] = [rows[i].label] + Array.new(cols.count, "")
      row_questions = rows[i].matrix_questions

      cols.count.times do |t|
        cell_question = row_questions.find_by(matrix_column_id: cols[t].id)

        if object.is_a?(Response) && object.is_passing_score?
          cell_answer = object.matrix_answers.find_by(matrix_question_id: cell_question.id)
          rep[i + 1][t + 1] = cell_answer.words.pluck(:content)
        else
          rep[i + 1][t + 1] = cell_question.words.pluck(:content)
        end
      end
    end

    rep
  end
end