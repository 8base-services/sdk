import { compose, withHandlers } from 'recompose';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import * as R from 'ramda';

import { withAuth } from './withAuth';

const USER_LOGIN_MUTATION = gql`
  mutation UserLogin($data: UserLoginInput!) {
    userLogin(data: $data) {
      success
      auth {
        refreshToken
        idToken
      }
      workspaces {
        name
        workspace
      }
    }
  }
`;

const getAuthStateFromResponse = (userLoginResponse) => ({
  idToken: R.path(['data', 'userLogin', 'auth', 'idToken'], userLoginResponse),
  refreshToken: R.path(['data', 'userLogin', 'auth', 'refreshToken'], userLoginResponse),
  workspaceId: R.path(['data', 'userLogin', 'workspaces', 0, 'workspace'], userLoginResponse),
});

const withLogIn = compose(
  withAuth,
  graphql(USER_LOGIN_MUTATION),
  withHandlers({
    logIn: ({ auth: { setAuthState }, mutate }) => async (data) => {
      const userLoginResponse = await mutate({ variables: { data }});

      const authState = getAuthStateFromResponse(userLoginResponse);

      setAuthState(authState);
    },
  }),
);

export { withLogIn };
