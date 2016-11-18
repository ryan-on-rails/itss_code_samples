module ResponseFactoryable
  extend ActiveSupport::Concern

  def initialize(response_data, uid)
    @data = response_data
    @response = Response.create(user_id: uid, activity_id: @data["activity_id"])
  end
end