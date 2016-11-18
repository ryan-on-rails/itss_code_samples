
class StudentArticleSerializer < BaseArticleSerializer
  attributes :en_title_paragraphs, :en_body_paragraphs, :en_main_idea_paragraphs, :en_recall_paragraphs, 
      :es_title_paragraphs, :es_body_paragraphs, :es_main_idea_paragraphs, :es_recall_paragraphs, 
      :es_slug, :en_slug, :is_hybrid

  def en_title_paragraphs
    paragraphs_collection = object.get_paragraph_collection(ArticleParagraphIntention.purposes['en_title'])
    return nil if paragraphs_collection.blank?
    paragraphs_collection.paragraphs.map do |paragraph|
      StudentParagraphSerializer.new(paragraph)  
    end  
  end


  def en_body_paragraphs
    paragraphs_collection = object.get_paragraph_collection(ArticleParagraphIntention.purposes['en_body'])
    return nil if paragraphs_collection.blank?
    paragraphs_collection.paragraphs.map do |paragraph|
      StudentParagraphSerializer.new(paragraph)  
    end     
  end

  def en_main_idea_paragraphs
    paragraphs_collection = object.get_paragraph_collection(ArticleParagraphIntention.purposes['en_main_idea'])
    return nil if paragraphs_collection.blank?
    paragraphs_collection.paragraphs.map do |paragraph|
      StudentParagraphSerializer.new(paragraph)  
    end  
  end

  def en_recall_paragraphs
    paragraphs_collection = object.get_paragraph_collection(ArticleParagraphIntention.purposes['en_recall'])
    return nil if paragraphs_collection.blank?
    paragraphs_collection.paragraphs.map do |paragraph|
      StudentParagraphSerializer.new(paragraph)  
    end  
  end

  def es_title_paragraphs
    paragraphs_collection = object.get_paragraph_collection(ArticleParagraphIntention.purposes['es_title'])
    return nil if paragraphs_collection.blank?
    paragraphs_collection.paragraphs.map do |paragraph|
      StudentParagraphSerializer.new(paragraph)  
    end  
  end


  def es_body_paragraphs
    paragraphs_collection = object.get_paragraph_collection(ArticleParagraphIntention.purposes['es_body'])
    return nil if paragraphs_collection.blank?
    paragraphs_collection.paragraphs.map do |paragraph|
      StudentParagraphSerializer.new(paragraph)  
    end   
  end

  def es_main_idea_paragraphs
    paragraphs_collection = object.get_paragraph_collection(ArticleParagraphIntention.purposes['es_main_idea'])
    return nil if paragraphs_collection.blank?
    paragraphs_collection.paragraphs.map do |paragraph|
      StudentParagraphSerializer.new(paragraph)  
    end  
  end

  def es_recall_paragraphs
    paragraphs_collection = object.get_paragraph_collection(ArticleParagraphIntention.purposes['es_recall'])
    return nil if paragraphs_collection.blank?
    paragraphs_collection.paragraphs.map do |paragraph|
      StudentParagraphSerializer.new(paragraph)  
    end  
  end

  def es_slug
    object.get_paragraph_collection(ArticleParagraphIntention.purposes['es_slug']).to_s
  end

  def en_slug
    object.get_paragraph_collection(ArticleParagraphIntention.purposes['en_slug']).to_s
  end

end
