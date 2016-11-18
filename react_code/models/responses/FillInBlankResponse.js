import Response from '../Response';

export default class FillInBlankResponse extends Response {
  constructor(activity) {
    super(activity);

    this.answers = activity.question.fill_in_blank_fields.map((field) => {
      return { fill_in_blank_field_id: field.id };
    });
  }

  toJSON() {
    return Object.assign({}, this.asJSON(), {
      answers: this.answers
    });
  }

  isValid() {
    const { answers, activity } = this;

    let fieldCount = activity.question.fill_in_blank_fields.length;
    let valid = answers &&
      answers.filter(a => a.content).length === fieldCount;

    return valid;
  }
}
