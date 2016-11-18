##
# Represents a synonym relationship between two words.
class SynonymPair < ActiveRecord::Base
  validate :check_for_existing_synonym_pair, :on => :create

  belongs_to :word1, :class_name => 'Word'
  belongs_to :word2, :class_name => 'Word'

  def self.is_accounted_for?(word1, word2)
    exists?(word1: word1, word2: word2) || exists?(word1: word2, word2: word1)
  end

  private

  def check_for_existing_synonym_pair
    if self.class.is_accounted_for?(word1, word2)
      errors.add(:base, "This synonym pair already exists!")
    end
  end
end
