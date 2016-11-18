import Response from '../Response';

export default class MatrixResponse extends Response {
  constructor(activity) {
    super(activity);

    this.answers = [];

    for(let k in activity.matrixWords) {
      let words = activity.matrixWords[k];

      if(words) {
        this.answers.push({ question_id: +k, words: words });
      }
    }
  }

  toJSON() {
    return Object.assign({}, this.asJSON(), {
      answers: this.answers
    });
  }

  isValid() {
    const { answers, activity } = this;

    let cellCount = activity.matrix_questions.length;
    let answerCount = answers ?
      answers.filter(a => a.words.length).length : 0;
    let valid = (answerCount === cellCount);

    return valid;
  }
}
