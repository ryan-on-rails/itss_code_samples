class KnownAbbreviation < ActiveRecord::Base
  after_commit :reinitialize_well_known_abbreviations, on: [:create, :update, :destroy]
  belongs_to :word

  def reinitialize_well_known_abbreviations
    require 'language_processor'
    LanguageProcessor.reinitialize_well_known_abbreviations
  end

  def delete
    self.destroy
  end
end
