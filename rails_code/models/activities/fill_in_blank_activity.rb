##
# An activity wherein students fill in the blank
# fields in a sentence or pattern.
class FillInBlankActivity < Activity
  #has_one :question, foreign_key: :activity_id

  def question_content_with_answers(response)
    content = question.content.dup
    answers = response.fill_in_blank_answers

    answers.count.times do |i|
      content.gsub!("@(#{i + 1})", answers[i].content)
    end

    content
  end

  #Note: Review. 
  def question
    Question.includes(fill_in_blank_fields: [:words]).find_by(activity_id: id)
  end
end
