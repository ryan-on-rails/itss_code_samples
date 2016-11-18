class Article < ActiveRecord::Base
  include ArticleHelper
  before_destroy :send_delete_downward
  acts_as_paranoid

  belongs_to :structure
  has_many :article_signaling_words, class_name: "ArticleSignalingWord", table_name: :article_words, dependent: :destroy
  has_many :signaling_words, through: :article_signaling_words, source: :word
  has_many :article_structure_words, class_name: "ArticleStructureWord", table_name: :article_words, dependent: :destroy
  has_many :structure_words, through: :article_structure_words, source: :word
  has_many :article_main_idea_words, class_name: "ArticleMainIdeaWord", table_name: :article_words, dependent: :destroy
  has_many :main_idea_words, through: :article_main_idea_words, source: :word
  has_many :article_detail_words, class_name: "ArticleDetailWord", table_name: :article_words, dependent: :destroy
  has_many :detail_words, through: :article_detail_words, source: :word
  has_many :article_paragraphs, dependent: :destroy
  has_many :paragraphs, -> { order 'article_paragraphs.position' }, through: :article_paragraphs, dependent: :destroy

  ##
  # Retrieve list of unique words associated
  # with the article.
  def words
    ArticleWord.where(article: self).joins(:word).map(&:word).uniq
  end

  def get_paragraph_collection(intent_id)
    paragrphs = get_paragraphs(intent_id)
    return nil if paragrphs.blank?
    ParagraphCollection.new(paragrphs)
  end

  def update_section(text_blob, intent_id, language_abbv='en')
    
    delete_section(intent_id)
    create_section(text_blob, intent_id, language_abbv)
  end

  def update_all_sections(article=nil)
    a = article || self
    ArticleParagraphIntention.purposes.each do |intent|
      intent_desc = intent[0]
      intent_id = intent[1]
      text_blob = a[intent_desc] if self.has_attribute? intent_desc
      current_blob = get_paragraph_collection( ArticleParagraphIntention.purposes[intent_desc] ).to_s
      next if text_blob == current_blob
      if intent_desc == 'es_slug' && !a.en_title.blank?
        es_slug = a.en_title.downcase.underscore
        next
      end

      if intent_desc == 'en_slug' && !a.en_title.blank?
        en_slug = a.en_title.downcase.underscore
        next
      end

      update_section(
        text_blob,
        intent_id,
        intent_desc.starts_with?('es_') ? 'es' : 'en'
      ) unless text_blob.blank?

    end
  end

  # this manually deletes all the records necessary to destroy the article structure
  #   - despite foreign keys on everything,
  #     and despite `dependent: destroy` on relations,
  #     calls to delete/destroy were leaving orphaned `sentence_paragraph`, `sentence`, and `sentence_word` records
  def delete_section(intent_id)
    article_paragrafs = get_article_paragraphs(intent_id)
    return nil if article_paragrafs.blank?
    article_paragrafs
      .map{|article_paragraph|
        article_paragraph.delete_paragraphs
      }
  end

  def send_delete_downward
    ArticleParagraphIntention.purposes.each do |intent|
      self.delete_section(intent[1])
    end
  end

  def en_slug=(value)
    update_section(
      value,
      ArticleParagraphIntention.purposes['en_slug'],
      'en'
    )
  end

  def en_slug
    get_paragraph_collection(
      ArticleParagraphIntention.purposes['en_slug']
    ).to_s
  end

  def es_slug=(value)
    update_section(
      value,
      ArticleParagraphIntention.purposes['es_slug'],
      'es'
    )
  end

  def es_slug
    get_paragraph_collection(  ArticleParagraphIntention.purposes['es_slug']).to_s
  end

  def is_hybrid
    english_blank = %w(en_title en_body en_main_idea en_main_idea_short en_recall).all? do |article_piece|
      #self[article_piece].blank?
      article_paragraphs.where(article_paragraph_intention_id: ArticleParagraphIntention.purposes[article_piece]).pluck(:id).blank? 
    end
    spanish_blank = %w(es_title es_body es_main_idea es_main_idea_short es_recall).all? do |article_piece|
      #self[article_piece].blank?
      article_paragraphs.where(article_paragraph_intention_id: ArticleParagraphIntention.purposes[article_piece]).pluck(:id).blank? 
    end
    !english_blank && !spanish_blank
  end

  private

  def create_section(text_blob, intent_id, language_abbv='en')
    return nil if text_blob.blank?
    return nil if !get_paragraph_collection(intent_id).blank?
    if id.nil?
      save
      reload
    end
    ArticleHelper.construct_paragraphs(text_blob, intent_id, id, language_abbv)
  end

  def get_article_paragraphs(intent_id)
    return nil if article_paragraphs.blank?
    article_paragraphs.includes([paragraph: [paragraph_sentences:[sentence:[sentence_words:[:default_translation, word: [:known_abbreviations, :language, :translations]]]]]]).where(article_paragraph_intention_id: intent_id)
  end

  def get_paragraphs(intent_id)
    article_paragrafs = get_article_paragraphs(intent_id)
    return nil if article_paragrafs.blank?
    article_paragrafs.map{|ap| ap.paragraph }
  end

end
