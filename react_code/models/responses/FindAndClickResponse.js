import Response from '../Response';

export default class FindAndClickResponse extends Response {
  constructor(activity) {
    super(activity);

    this.answer = {
      question_id: activity.question.id,
      words: activity.selectedWords
    };
  }

  toJSON() {
    return Object.assign({}, this.asJSON(), {
      answer: this.answer
    });
  }

  isValid() {
    const { answer, activity } = this;

    let valid = answer.words &&
      answer.words.length === activity.question.words.length;

    return valid;
  }
}
