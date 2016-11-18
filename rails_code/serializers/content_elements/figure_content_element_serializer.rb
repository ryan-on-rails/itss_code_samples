class FigureContentElementSerializer < ContentElementSerializer
  attributes :slug

  has_one :structure, serializer: StructureWordsSerializer
end
