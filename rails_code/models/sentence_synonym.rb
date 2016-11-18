class SentenceSynonym < ActiveRecord::Base
  belongs_to :base_sentence, :class_name => 'Sentence', :foreign_key => 'base_sentence_id'
  belongs_to :synonym_sentence, :class_name => 'Sentence', :foreign_key => 'synonym_sentence_id'
  has_attached_file :image,
                    path: 'public/uploads/:class/:id/:filename',
                    url: 'uploads/:class/:id/:filename'
  validates_attachment_file_name :image, matches: [/png\Z/,/jpe?g\Z/,/gif\Z/,]

end
