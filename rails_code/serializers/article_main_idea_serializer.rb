class ArticleMainIdeaSerializer < BaseArticleSerializer
  attributes :en_title_paragraphs, :en_main_idea_paragraphs, 
      :es_title_paragraphs, :es_main_idea_paragraphs,
      :es_slug, :en_slug, :is_hybrid

  def en_title_paragraphs
    paragraphs_collection = object.get_paragraph_collection(ArticleParagraphIntention.purposes['en_title'])
    return nil if paragraphs_collection.blank?
    paragraphs_collection.paragraphs.map do |paragraph|
      ParagraphSerializer.new(paragraph)  
    end  
  end

  def en_main_idea_paragraphs
    paragraphs_collection = object.get_paragraph_collection(ArticleParagraphIntention.purposes['en_main_idea'])
    return nil if paragraphs_collection.blank?
    paragraphs_collection.paragraphs.map do |paragraph|
      ParagraphSerializer.new(paragraph)  
    end  
  end

  def es_title_paragraphs
    paragraphs_collection = object.get_paragraph_collection(ArticleParagraphIntention.purposes['es_title'])
    return nil if paragraphs_collection.blank?
    paragraphs_collection.paragraphs.map do |paragraph|
      ParagraphSerializer.new(paragraph)  
    end  
  end


  def es_main_idea_paragraphs
    paragraphs_collection = object.get_paragraph_collection(ArticleParagraphIntention.purposes['es_main_idea'])
    return nil if paragraphs_collection.blank?
    paragraphs_collection.paragraphs.map do |paragraph|
      ParagraphSerializer.new(paragraph)  
    end  
  end


  def es_slug
    object.get_paragraph_collection(ArticleParagraphIntention.purposes['es_slug']).to_s
  end

  def en_slug
    object.get_paragraph_collection(ArticleParagraphIntention.purposes['en_slug']).to_s
  end

end
