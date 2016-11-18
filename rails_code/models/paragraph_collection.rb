class ParagraphCollection
  def initialize(paragraphs=[])
    @paragraphs = paragraphs
  end

  def add(sentence_collection)
    @paragraphs.push sentence_collection
  end

  def paragraphs
    @paragraphs
  end

  def to_s
    @paragraphs.map{|paragraph|  
      paragraph.sentences.map{|sentence| sentence.to_s }.join(' ')
    }.reject {|p| p.empty?}.join("\n\n")
  end

end