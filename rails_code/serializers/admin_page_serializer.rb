class AdminPageSerializer < ActiveModel::Serializer
  attributes :id, :position, :next_page_id, :activities,
    :content_elements

  def next_page_id
    object.next_page.try(:id)
  end

  def activities
    object.activities.map do |activity|
      "#{activity.type}Serializer".constantize.new(activity)
    end
  end

  def content_elements
    #return unless scope
    content_elements = object.content_elements.map { |ce|
      case ce.type
        when "ArticleContentElement"
          BaseArticleContentElementSerializer.new(ce, { scope: scope })
        when "MainIdeaContentElement"
          BaseMainIdeaContentElementSerializer.new(ce, { scope: scope })
        when "RecallContentElement"
          BaseRecallContentElementSerializer.new(ce, { scope: scope })
        when "AnswerContentElement"
          BaseAnswerContentElementSerializer.new(ce, { scope: scope })
        else
          "#{ce.type}Serializer".constantize.new(ce, { scope: scope })
      end
      
    }.compact
    content_elements || []
  end

  def include_content_elements?
    !!scope
  end
end
