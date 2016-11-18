import Response from '../Response';

export default class QuestionAnswerResponse extends Response {
  constructor(activity) {
    super(activity);

    this.answer = { question_id: activity.question.id };
  }

  toJSON() {
    return Object.assign({}, this.asJSON(), {
      answer: this.answer
    });
  }

  isValid() {
    const { answer } = this;

    let valid = answer && answer.content;

    return valid;
  }
}
