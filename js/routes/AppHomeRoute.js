import Relay from 'react-relay';

export default class extends Relay.Route {
  static queries = {
    post: () => Relay.QL`
      query {
        Post
      }
    `,
  };
  static routeName = 'AppHomeRoute';
}