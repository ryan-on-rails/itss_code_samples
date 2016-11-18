module ContentElementHelper
  def save_content_element(_content_element, page_id)
    model = _content_element.type.constantize
    content_element_id = _content_element.id
    content_element = content_element_id.present? ? ContentElement.find_or_initialize_by(id: content_element_id) : ContentElement.new

    case _content_element.type
    when "ArticleContentElement"
      article_id = _content_element.delete("article_id")
      clickable = _content_element.delete("clickable")
      show_title = _content_element.delete("show_title") || false
      content_element.update(article_id: article_id, page_id: page_id, clickable: clickable, show_title: show_title, type: "ArticleContentElement")
    when "RichTextContentElement"
      en_content = _content_element.delete("en_content")
      es_content = _content_element.delete("es_content") || ""
      clickable = _content_element.delete("clickable")

      content_element.update(en_content: en_content, es_content: es_content, page_id: page_id, clickable: clickable, type: "RichTextContentElement")
    when "FigureContentElement"
      slug = _content_element.delete("slug")
      structure_id = _content_element.delete("structure_id") || 1
      clickable = _content_element.delete("clickable")
      content_element.update(page_id: page_id, clickable: clickable, type: "FigureContentElement", slug: slug, structure_id: structure_id)
    when "MainIdeaContentElement"
      article_id = _content_element.delete("article_id")
      clickable = _content_element.delete("clickable")
      content_element.update(article_id: article_id, page_id: page_id, clickable: clickable, type: "MainIdeaContentElement")
    when "MediaContentElement"
      content_element.update(page_id: page_id, type: "MediaContentElement")
      mce = MediaContentElement.find(content_element.id) #stupid work around but im tired of looking at this
      file_str = _content_element.delete("media_url")
      file_name = _content_element.delete("media_file_name")
      updated = _content_element.delete("media_is_updated") || false
      if updated || content_element_id.blank?
        regexp = /\Adata:([-\w]+\/[-\w\+\.]+)?;base64,(.*)/m
        data_uri_parts = file_str.match(regexp) || []
        File.open("#{Rails.root}/tmp/#{file_name}", 'wb') do |file|
            file.write(Base64.decode64(data_uri_parts[2]))
        end
        if File.exist?("#{Rails.root}/tmp/#{file_name}")
          file = File.open("#{Rails.root}/tmp/#{file_name}")
          mce.update(media: file)
          file.close
          File.delete("#{Rails.root}/tmp/#{file_name}")
        end
      end
      #return false

    else
      return false
    end
    content_element.id
  end
end
