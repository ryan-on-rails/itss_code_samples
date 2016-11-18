require 'language_processor'

module ArticleHelper
  include SentenceHelper

  def self.construct_paragraphs(raw_text, intent_id, article_id, language_abbv='en')
    paragraphs = LanguageProcessor.split_into_paragraphs(raw_text)
    language = Language.find_by(abbv: language_abbv)
    paragraph_collection = create_paragraph_collection(paragraphs, language)
    save_paragraph_collection(paragraph_collection, intent_id, article_id)
  end

  def self.create_paragraph_collection(paragraphs, language)
    paragraph_collection = ParagraphCollection.new
    paragraphs.each{|paragraph|
      sentence_collection = SentenceCollection.new
      paragraph.each do |sentence| sentence_collection.add SentenceHelper.construct_sentence sentence, language end
      paragraph_collection.add sentence_collection
    }
    paragraph_collection
  end

  def self.save_paragraph_collection(paragraph_collection, intent_id, article_id)
    new_paragraph_collection = ParagraphCollection.new
    paragraph_collection.paragraphs.each_with_index do |paragraf, paragraf_position|
      paragraph = Paragraph.create()
      paragraf.sentences.each_with_index do |sentence, sentence_position|
        ParagraphSentence.create(paragraph_id: paragraph.id, sentence_id: sentence.id, position: sentence_position)
      end
      ArticleParagraph.create(article_id: article_id, paragraph_id: paragraph.id, article_paragraph_intention_id: intent_id, position: paragraf_position)
      new_paragraph_collection.add paragraph.reload
    end
    new_paragraph_collection
  end

  def self.paragraph_records_to_paragraph_collections(paragraph_records)
    ParagraphCollection.new(paragraph_records)
  end
  
end