class ArticleParagraph < ActiveRecord::Base
  belongs_to :article, foreign_key: :article_id
  belongs_to :paragraph, foreign_key: :paragraph_id
  belongs_to :article_paragraph_intention, foreign_key: :article_paragraph_intention_id
  
  def delete_paragraphs    
    paragraph.delete_paragraph_sentences 
    destroy
  end
end
