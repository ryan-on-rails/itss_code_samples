import Response from '../Response';

export default class CompositionResponse extends Response {
  constructor(activity) {
    super(activity);

    // TODO: Address these defensive guards
    if(!activity.questions) { return; }

    this.answers = activity.questions.map(q => {
      return { question_id: q.id };
    });
  }

  toJSON() {
    return Object.assign({}, this.asJSON(), {
      answers: this.answers
    });
  }

  isValid() {
    const { answers, activity } = this;

    let valid = answers &&
      answers.filter(a => a.content).length === activity.questions.length;

    return valid;
  }
}
