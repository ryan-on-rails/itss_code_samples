class LessonAttachment < ActiveRecord::Base
  belongs_to :lesson
  acts_as_paranoid
  has_attached_file :attachment,
                    path: 'public/uploads/:class/:id/:filename',
                    url: 'uploads/:class/:id/:filename'
  validates_attachment_file_name :attachment, matches: [/png\Z/,
                                                        /jpe?g\Z/,
                                                        /gif\Z/,
                                                        /mp3\Z/,
                                                        /ogg\Z/,
                                                        /wav\Z/,
                                                        /txt\Z/,
                                                        /docx\Z/,
                                                        /pdf\Z/]
end
