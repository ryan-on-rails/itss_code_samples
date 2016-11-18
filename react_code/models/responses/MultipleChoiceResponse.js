import Response from '../Response';

export default class MultipleChoiceResponse extends Response {
  constructor(activity) {
    super(activity);

    this.answers = activity.answers || [];
    this.max_answers = 1;
    if(activity.question && activity.question.answer_count) { this.max_answers = activity.question.answer_count || 1};
  }

  addAnswer(option) {
    // NOTE: For a "select multiple" activity, this allows
    // the student to infer exactly how many "correct" answers
    // there are. If this becomes a problem, we may explore
    // extending the logic here such that it only cares
    // about activities for which there is a single answer.
    if(this.answers.length >= this.max_answers) {
      this.answers.shift();
    }

    this.answers.push({
      multiple_choice_option_id: option.id
    });
  }

  hasAnswer(option) {
    return !!this.answers.find(a => {
      return a.multiple_choice_option_id === option.id;
    });
  }

  removeAnswer(option) {
    this.answers = this.answers.filter(a => {
      return a.multiple_choice_option_id !== option.id;
    });
  }

  toJSON() {
    return Object.assign({}, this.asJSON(), {
      answers: this.answers
    });
  }

  isValid() {
    return this.answers.length > 0;
  }
}
