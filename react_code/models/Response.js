export default class Response {
  constructor(activity) {
    this.activity = activity;
    this.type = activity.type.match(/(.*)Activity/)[1];
  }

  asJSON() {
    return {
      activity_id: this.activity.id,
      type: this.type
    };
  }

  isValid() {
    throw 'Not implemented!';
  }
}
