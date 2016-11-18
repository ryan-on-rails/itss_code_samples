class Paragraph < ActiveRecord::Base
  has_many :paragraph_sentences, -> { order 'paragraph_sentences.position' }, dependent: :destroy
  has_many :sentences, -> { order 'paragraph_sentences.position' }, through: :paragraph_sentences, dependent: :destroy
  
  def delete_paragraph_sentences
    paragraph_sentences.map{|paragraph_sentence| paragraph_sentence.delete_sentence }
    destroy
  end

  def to_s
    str = ''
    sentences.each
  end
end
