class PagesController < ApplicationController
  def index
    return redirect_to new_user_session_path unless current_user
    return redirect_to "http://fasct.org/"   unless current_user.is_supported?

    #make sure the student is assigned to a lesson/activity and current lesson it still published
    if current_user.is_a?(Student)
      sps = StudentProgressService.new(current_user)
      sps.reset_unassigned_student
      sps.move_to_next_published_lesson
    end

    state = current_user.is_a?(Administrator) ? AdminStateSerializer.new(current_user).to_json : current_user.serialize!.to_json
    @env = Rails.env
    @state = if Rails.env.production?
               state
             else
               JSON.pretty_generate(JSON.parse(state))
             end
    @redirect = current_user.application_root
  end
end
