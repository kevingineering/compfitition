import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthContext from '../../contexts/auth/authContext';

//taking component and anything else as rest, creates a route that is only reachable if you have been authenticated
const PrivateRoute = ({ component: Component, ...rest }) => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, loading } = authContext;

  return (
    <Route { ...rest } render={ props => !isAuthenticated && !loading ? (
        <Redirect to='/login' />
      ) : (
        <Component{ ...props } />
      )} />
  );
};

export default PrivateRoute;