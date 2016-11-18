class ResponseContent
  # The content of a given response is spread out through a variety of
  # potential answer objects. This object encodes how to bring those
  # together.

  attr_reader :response, :content

  def initialize(response, content)
    @response = response
    @content = content
  end

  def self.from_response(response)
    content = case response.activity.type
    when 'InfoActivity'
      ['']
    when 'CompositionActivity'
      answers_content(response)
    when 'QuestionAnswerActivity'
      answers_content(response)
    when 'FillInBlankActivity'
      fill_in_blank_content(response)
    when 'FindAndClickActivity'
      find_and_click_content(response)
    when 'MatrixActivity'
      matrix_content(response)
    when 'MultipleChoiceActivity'
      multiple_choice_content(response)
    when 'TreeActivity'
      tree_content(response)
    end
    ResponseContent.new(response, content)
  end

  def self.responses_with_answers(opts = {})
    all_responses = Response.all.includes(includes)
    unless opts[:classroom_id].blank?
      all_responses = all_responses
                      .where('users.classroom_id = ?', opts[:classroom_id])
                      .references(:user)
    end
    all_responses
  end

  def as_json(_options = {})
    response.as_json.merge({ 'content': content }.as_json)
  end

  def content_string
    @content.flatten.join(' ')
  end

  def left_blank?
    response.activity.type != 'InfoActivity' && content_string.blank?
  end

  def activity_id
    response.activity.id
  end

  #
  # private
  #

  def self.includes
    [
      :user,
      :activity,
      :answers,
      :fill_in_blank_answers,
      {find_and_click_answer: :words},
      {matrix_answers: :words},
      {multiple_choice_answers: :multiple_choice_option},
      :tree_answers,
    ]
  end

  def self.answers_content(response)
    response.answers.map(&:content)
  end

  def self.fill_in_blank_content(response)
    response.fill_in_blank_answers.map(&:content)
  end

  def self.find_and_click_content(response)
    return [''] if response.find_and_click_answer.nil?
    [response.find_and_click_answer.words.map(&:content)]
  end

  def self.matrix_content(response)
    response.matrix_answers.map { |ma| ma.words.map(&:content) }
  end

  def self.multiple_choice_content(response)
    response.multiple_choice_answers.map { |mca| mca.multiple_choice_option.label }
  end

  def self.tree_content(response)
    response.tree_answers.map(&:content)
  end

  private_class_method :includes, :answers_content, :fill_in_blank_content,
                       :find_and_click_content, :matrix_content, :multiple_choice_content,
                       :tree_content
end
