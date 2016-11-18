class UserSerializer < ActiveModel::Serializer
  attributes :id, :username, :type, :gender, :current_activity_id,
             :classroom_id, :admin?, :teacher?, :student?,
             :first_name, :last_name, :watched_intro, :is_hybrid?, :preferred_language,
             :is_spanish?, :is_english?

  has_one :classroom, serializer: BaseClassroomSerializer
  has_many :languages, serializer: BaseLanguageSerializer

  def preferred_language
    (object.languages.count == 1 && object.languages.pluck(:abbv).include?("es")) ? "es" : "en"
  end
end
