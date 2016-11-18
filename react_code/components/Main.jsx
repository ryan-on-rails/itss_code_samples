import React from 'react';

/* Main
 *
 * This is the root of the application.
 *
 * Since there are several different interfaces (admin, dashboard, student app)
 * this component is super light and just handles delegation for Routes
 */
class Main extends React.Component {
  render() {
    return (
      <div className="itss-main">
        {this.props.children}
      </div>
    )
  }
}

export default Main
