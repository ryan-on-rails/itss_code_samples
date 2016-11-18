class FindAndClickQuestionSerializer < ActiveModel::Serializer
  attributes :id, :content, :words_string

  has_many :words

  def words_string
  	object.words.pluck(:content).join(", ")
  end
end
