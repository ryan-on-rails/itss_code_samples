import Response from '../Response';

export default class InfoResponse extends Response {
  constructor(activity) {
    super(activity);
  }

  toJSON() {
    return Object.assign({}, this.asJSON(), {});
  }

  isValid() {
    return true;
  }
}
