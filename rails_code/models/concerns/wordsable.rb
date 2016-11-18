module Wordsable
  extend ActiveSupport::Concern

  # -----------------------------------------------------------------
  # Mixin for activity questions and answers that can be linked
  # with words.
  # -----------------------------------------------------------------

  included do
    has_and_belongs_to_many :words
  end

  def raw_words
    words.map { |w| w.content.downcase }
  end
end
