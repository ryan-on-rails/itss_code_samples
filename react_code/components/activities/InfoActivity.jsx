import React, { PropTypes } from 'react';
import { connect }          from 'react-redux';
import InfoResponse         from '../../models/responses/InfoResponse';

class InfoActivity extends React.Component {
  static propTypes = {
    activity: PropTypes.any.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { activity, responseDisabled } = this.props;

    return (
      <div className="act-response act-response--info">
        <button disabled={responseDisabled}
          className="act-response__submit-btn o-btn-action"
          onClick={() => this.handleSubmit()}>          
          {(user.preferred_language == "es" ? "Continuar" : "Continue")}
        </button>
      </div>
    );
  }

  handleSubmit() {
    let response = new InfoResponse(this.props.activity);
    this.props.onSubmit(response);
  }
}

function select(state) {
  return { activity: state.activity };
}

export default connect(select)(InfoActivity);
