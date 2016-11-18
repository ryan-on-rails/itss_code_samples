class ResponseService
  def submit_response(resp, student)
    sr = SubmissionResponse.new

    if Activity::TYPES.include?(resp[:type])
      factory_klass = "#{resp[:type]}ResponseFactory".constantize

      # Save response data; score response; get feedback
      resp = factory_klass.new(resp, student.id).build
      scored_resp = ScoringService.new(resp).score

      feedback = nil
      # Get feedback for response
      if scored_resp.activity.is_a?(InfoActivity)
        # Default feedback
        feedback = default_passing_feedback
      elsif(scored_resp.attempt == scored_resp.max_attempt && !scored_resp.is_passing_score?)
        feedback = Feedback.find_by(slug: "moveon")
      else
        if condition = FeedbackCondition.get_for_response(scored_resp)
          feedback = condition.feedback
        else
          # If we haven't matched a condition, we choose the
          # default passing or non-passing feedback based on whether
          # or not the response has a passing score.
          feedback = if scored_resp.is_passing_score?
            default_passing_feedback(scored_resp.activity.page.lesson)
          else
            default_non_passing_feedback(scored_resp.activity.page.lesson)
          end
        end
      end

      # If an "incorrect" feedback (indicating that the
      # answer is not correct) has been selected, we know to
      # show the answer (pending a score check).

         ##### Replaced with is_failing attribute on the feedback record
      # incorrect_slugs = %W[AddDetails AddMain AddMainDet AddMainDetSig
      #                      AddMainSig addMrInf addMsing AddSigDet
      #                      AddSigDet allCrctns checkMyAnswers correctByMine
      #                      correctmodel correctYourWork crtSigWrds crtYrWrk
      #                      goodTry lookAtMine moreInformation nowTry
      #                      oops pleasecorrectanswer PlzBeSure plzChk
      #                      plzCrtWrk plzRdMI plzReadAdd tryagain L6N6
      #                      uzMainIdea L28N12 L5N8 L6N14]

      sr.show_answer = false
      if !scored_resp.is_passing_score? && scored_resp.attempt > 1 #&& feedback.is_failing?
        sr.show_answer = true
      end
      if scored_resp.is_passing_score? &&  feedback.is_failing?
        feedback = default_passing_feedback
      end

      # if incorrect_slugs.include?(feedback.slug) && scored_resp.attempt > 1 #added the greater than 1
      #   # Feedback condition failed us if we have a passing score
      #   # with a feedback slug that indicates otherwise.

      #   # NOTE: This is likely cause to review the feedback conditions
      #   # and understand why they sometimes fail to align with the
      #   # notion of a passing score.
      #   if scored_resp.is_passing_score?
      #     feedback = default_passing_feedback
      #     false
      #   else
      #     sr.show_answer = true
      #   end
      # else
      #   # After the third attempt, show the answer
      #   (scored_resp.attempt >= 3 &&
      #    !scored_resp.is_passing_score?)
      # end

      move_on_slugs = %W[moveon]
      if(scored_resp.is_passing_score? || move_on_slugs.include?(feedback.slug))
        # Update student's current activity
        progress_service = StudentProgressService.new(student)
        progress_service.move_forward(scored_resp.activity)
      end

      sr.response = scored_resp
      sr.feedback = feedback
    else
      sr.error!({ message: "Invalid activity type." })
    end

    sr
  end

  private

  def default_passing_feedback(lesson=nil)
    if lesson.present?
      return lesson.default_pass_feedback if lesson.default_pass_feedback.present?
    end
    #else
    Feedback.find_by(slug: "wtogo")
  end

  def default_non_passing_feedback(lesson=nil)
    if lesson.present?
      return lesson.default_fail_feedback if lesson.default_fail_feedback.present?
    end
    #else
    Feedback.find_by(slug: "tryagain")
  end

  class SubmissionResponse
    attr_accessor :response, :feedback, :show_answer
    attr_reader :errors

    def initialize
      @success = true
      @errors = []
      @show_answer = false
    end

    def success?
      @success
    end

    def error!(errors)
      @success = false
      @errors = errors
    end
  end
end
