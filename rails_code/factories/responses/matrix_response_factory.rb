class MatrixResponseFactory
  include ResponseFactoryable

  def build
    @data["answers"].each do |a|
      ma = @response.matrix_answers.create(matrix_question_id: a["question_id"])

      a["words"].each do |w|
        words = Word.where('lower(content) = ?', w.downcase)
        word = words.find_by(content: w) || words.first
        ma.words << word if word
      end
    end

    @response
  end
end