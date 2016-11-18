class ResponseFeedbackSerializer < ActiveModel::Serializer
  attributes :response, :feedback, :representation,
    :answer_representation

  def response
    ResponseSerializer.new(object.response)
  end

  def feedback
    FeedbackSerializer.new(object.feedback)
  end

  # Needed to populate future-page content elements
  def answer_representation
    get_representation if object.response.is_passing_score?
  end

  FEEDBACKS_WITH_ANSWER = %w( L8MainL L8aMainL L14Main
    L28eRecall L5.5Recall L14aRecall L5.5aRecall L14eMain L28eMain
    LStruProSol L17aN10 L17aN8 L12Main L29N9 l12eRecall L3N16 L3eN12
    L3eN16 L5.5aMainL L13Recall L6MainL3 L6MainL2 L6MainL1 L5.5MainL
    L5.5MainS L5.5aMainS L7eMain L6aMainL1 L6aMainL3 L7Main L7Recall
    L28Recall L12Recall L14aMain L28Main L27eRecall L27Recall L29Recall
    L31N14 L29eRecall L13Main L34Recall L14eRecall L12aMain L14Recall
    L12aRecall l12eMain L16eRecall L17N8 L13eRecall L6aMainL2 L7eRecall
    L17N10 L31N13 L16Recall L13eMain L21Recall
  )

  def representation
    get_representation if (object.show_answer && FEEDBACKS_WITH_ANSWER.exclude?(object.feedback.slug))
  end

  private

  def get_representation
    return if object.response.activity.is_a?(InfoActivity)
    klass = "#{object.response.activity.type_slug}RepresentationSerializer".constantize
    @rep ||= klass.new(object.response)
  end
end
