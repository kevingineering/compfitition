import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Home from './components/pages/Home';
import About from './components/pages/About';
import NotFound from './components/pages/NotFound';
import Navbar from './components/layout/Navbar';
import Alert from './components/layout/Alert';
import GoalPage from './components/goals/GoalPage';
import GoalForm from './components/goals/GoalForm';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import UserPage from './components/auth/UserPage';
import SearchPage from './components/searchableUsers/SearchPage';
import FriendPage from './components/friends/Friend/FriendPage';
import FriendGoalPage from './components/friends/Friend/FriendGoalPage';

import Test from './components/pages/Test';

import GoalState from './contexts/goals/goalState';
import AuthState from './contexts/auth/authState';
import AlertState from './contexts/alerts/alertState';
import SearchableUsersState from './contexts/searchableUsers/searchableUsersState';
import FriendState from './contexts/friends/friendState';
// import CompetitionState from './contexts/competitions/competitionState';
import RequestState from './contexts/requests/requestState';

import setAuthToken from './utils/setAuthToken';
import PrivateRoute from './components/routing/PrivateRoute';

import './App.css';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  //Make routes private
  return (
    <AuthState>
      <AlertState>
        <GoalState>
          <FriendState>
            <SearchableUsersState>
              <RequestState>
                <Router>
                  <React.Fragment>
                    <Navbar />
                    <div className="container">
                      <Alert />
                      <Switch>
                        <Route exact path='/register' component={Register}/>
                        <Route exact path='/login' component={Login}/>
                        <PrivateRoute exact path='/user/:id' component={UserPage}/>
                        <PrivateRoute exact path='/' component={Home}/>
                        <Route exact path='/test' component={Test}/>
                        <PrivateRoute exact path='/goalform' component={GoalForm}/>
                        <Route exact path='/about' component={About}/>
                        <PrivateRoute exact path='/goal/:id' component={GoalPage}/>
                        <PrivateRoute exact path='/search' component={SearchPage}/>
                        <PrivateRoute exact path='/friend/:id' component={FriendPage}/>
                        <PrivateRoute exact path='/friend/goal/:id' component={FriendGoalPage}/>
                        <Route component={NotFound}/>
                      </Switch>
                    </div>
                  </React.Fragment>
                </Router>
              </RequestState>
            </SearchableUsersState>
          </FriendState>
        </GoalState>
      </AlertState>
    </AuthState>
  );
};

export default App;