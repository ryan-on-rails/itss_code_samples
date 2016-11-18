class BaseWordSerializer < ActiveModel::Serializer
  attributes :id, :content, :language_abbv, :language_id, :is_abbv

  def language_abbv
    object.language.abbv
  end
  def is_abbv
    object.is_well_known_abbreviation?
  end
end
