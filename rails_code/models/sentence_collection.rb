class SentenceCollection
  def initialize()
    @sentences = []
  end

  def delete
    @sentences.each do |sentence|
      sentence.destroy
    end
  end

  def sentences
    @sentences
  end

  def add(s)
    @sentences.push s
  end

  def to_s
    @sentences.map{|x|x.to_s}.join(' ')
  end

end