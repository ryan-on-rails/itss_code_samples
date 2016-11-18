class Translation < ActiveRecord::Base
  belongs_to :word, foreign_key: :source_word_id
  belongs_to :word, foreign_key: :target_word_id
  belongs_to :target_word, :class_name => "Word", foreign_key: :target_word_id
  belongs_to :language_transitive, foreign_key: :language_transitive_id

end
