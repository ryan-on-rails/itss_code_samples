class StudentParagraphSerializer < ActiveModel::Serializer
  attributes :id

  has_many :sentences, serializer: StudentSentenceSerializer

end
