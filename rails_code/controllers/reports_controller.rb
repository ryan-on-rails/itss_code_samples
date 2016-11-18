class ReportsController < ApplicationController
	before_action :check_for_key

	def get_roster
		ImportFromAdminService.new.import_students_for_classroom(params[:classroom_id])
		csr = ClassroomRosterSerializer.new(params[:classroom_id])
		render :json => { :roster => csr.roster }, :status => 200
	end

	def get_high_scores
		hsr = ClassroomHighScoreReportSerializer.new(params[:classroom_id])
		render :json => { :roster => hsr.report_data }, :status => 200
	end

	def get_gaming
		gsr = ClassroomGamingReportSerializer.new(params[:classroom_id])
		render :json => { :roster => gsr.report_data }, :status => 200
	end

	def get_main_idea
		mir = ClassroomMainIdeaReportSerializer.new(params[:classroom_id])
		render :json => { :roster => mir.report_data }, :status => 200
	end

	def get_recent_responses
		rrr = ClassroomRecentActivitySerializer.new(params[:classroom_id])
		render :json => { :roster => rrr.report_data }, :status => 200
	end

	def check_for_key
		unless params[:app_exchange_key].present? && params[:app_exchange_key] == APP_EXCHANGE_KEY
			render :json => { :error => "app exchange key not present" }, :status => 401
		end
	end

	##
	# Returns parameters for a student
	def student_params
		params.require(:student).permit(:first_name, :last_name, :username, :type, :email, :classroom_id, :administrator, :encrypted_plain_pass, :encrypted_plain_pass_salt,
			:encrpyted_plain_pass_iv, :special_ed, :gender, :grade_level, :student_id, :role, :type)
	end
end
