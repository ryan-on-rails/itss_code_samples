# Represents a selection of rich text (WYSIWYG).
class RichTextContentElement < ContentElement
  validates :en_content, presence: true
  validates :es_content, presence: false
end
