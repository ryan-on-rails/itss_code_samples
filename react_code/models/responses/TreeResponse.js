import Response from '../Response';

export default class TreeResponse extends Response {
  constructor(activity) {
    super(activity);

    this.answers = [];
    this.addToAnswers(activity.root_nodes[0]);
  }

  addToAnswers(node) {
    if(node.tree_question){
      this.answers.push({ tree_question_id: node.tree_question.id });
    }

    if(node.child_nodes.length > 0) {
      node.child_nodes.forEach(child => {
        this.addToAnswers(child);
      });
    }
  }

  toJSON() {
    return Object.assign({}, this.asJSON(), {
      answers: this.answers
    });
  }

  isValid() {
    const { answers, activity } = this;

    let fieldCount = this.answers.length;
    let valid = answers &&
      answers.filter(a => a.content).length === fieldCount;

    return valid;
  }
}
