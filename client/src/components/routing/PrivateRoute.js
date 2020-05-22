import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'
import AuthContext from '../../contexts/auth/authContext'
import PropTypes from 'prop-types'

//taking component and anything else as rest, creates a route that is only reachable if you have been authenticated
const PrivateRoute = ({ component: Component, ...rest }) => {

 //console.log{'PrivateRoute')

  const authContext = useContext(AuthContext)
  const { isAuthenticated, loading } = authContext

  return (
    <Route { ...rest } render={ props => !isAuthenticated && !loading ? (
        <Redirect to='/register' />
      ) : (
        <Component{ ...props } />
      )} />
  )
}

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
}

export default PrivateRoute