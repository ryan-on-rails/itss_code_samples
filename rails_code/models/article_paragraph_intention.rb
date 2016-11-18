class ArticleParagraphIntention < ActiveRecord::Base
  enum purpose: {
    slug:               1,
    en_title:           2,
    es_title:           3,
    en_body:            4,
    es_body:            5,
    en_main_idea:       6,
    es_main_idea:       7,
    en_main_idea_short: 8,
    es_main_idea_short: 9,
    en_recall:          10,
    es_recall:          11,
    en_slug:            12,
    es_slug:            13
  }

end
