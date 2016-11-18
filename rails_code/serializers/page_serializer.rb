class PageSerializer < BasePageSerializer
  attributes :activities, :content_elements


  def activities
    object.activities.map do |activity|
      "#{activity.type}Serializer".constantize.new(activity)
    end
  end

  def content_elements
    #return unless scope
    object.content_elements.map { |ce|
      "#{ce.type}Serializer".constantize.new(ce, { scope: scope })
    }
  end

  def include_content_elements?
    !!scope
  end
end
