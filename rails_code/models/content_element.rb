##
# Represents an element of content that can appear
# in a page's content area.
class ContentElement < ActiveRecord::Base
  include Orderable
  before_validation :set_structure, on: :create
  acts_as_paranoid

  validates :page, presence: true

  belongs_to :page
  belongs_to :structure

  # Scope for Orderable
  def orderables
    page.content_elements
  end

  private

  #Updated to link to specific structures.
  #Some lessons have a structure for an old lesson
  #this sets the structure to the current lesson structure if one is not provided
  def set_structure
    if !self.structure
        self.structure = self.page.lesson.structure
    end
  end
end
