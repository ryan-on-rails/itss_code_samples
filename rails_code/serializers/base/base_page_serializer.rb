class BasePageSerializer < ActiveModel::Serializer
  attributes :id, :position, :next_page_id

  def next_page_id
    object.next_page.try(:id)
  end

end
