import React from 'react';
import Relay from 'react-relay';

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Post list</h1>
        <ul>
        </ul>
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  fragments: {
    post: () => Relay.QL`
      fragment on Post {
        title
      }
    `,
  },
});
