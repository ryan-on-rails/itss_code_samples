##
# Represents a text-based figure (e.g., table of words)
# content element.
class FigureContentElement < ContentElement
  # The 'content' attribute identifies the type of figure
  validates :slug, inclusion: { in: %W[structure-table
                                       tree-diagram
                                       signaling-words
                                       main-idea-pattern
                                       writing-pattern] }

end
