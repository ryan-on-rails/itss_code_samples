class BaseArticleSerializer < ActiveModel::Serializer
  attributes :id, :en_title, :es_title, :structure_name, :structure_id, :en_structure_name, :es_structure_name

  #left for legacy porpuses 
  def structure_name
    object.structure.name
  end
  def en_structure_name
    object.structure.name
  end
  def es_structure_name
    object.structure.es_name
  end
  
  def en_title
    object.get_paragraph_collection(ArticleParagraphIntention.purposes['en_title']).to_s
  end
  def es_title
    object.get_paragraph_collection(ArticleParagraphIntention.purposes['es_title']).to_s
  end
end