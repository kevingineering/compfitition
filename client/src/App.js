import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Contexts from './contexts/Contexts';
import setAuthToken from './utils/setAuthToken';
import PrivateRoute from './components/routing/PrivateRoute';

import Home from './components/pages/Home';
import About from './components/pages/About';
import NotFound from './components/pages/NotFound';
import Navbar from './components/layout/Navbar';
import Alert from './components/layout/Alert';
import GoalPage from './components/goals/page/GoalPage';
import GoalForm from './components/goals/form/GoalForm';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import UserPage from './components/user/UserPage';
import SearchPage from './components/searchableUsers/SearchPage';
import FriendPage from './components/friends/friend/FriendPage';
import FriendGoalPage from './components/friends/friend/FriendGoalPage';
import CompetitionForm from './components/competitions/form/CompetitionForm';
import CompetitionPage from './components/competitions/CompetitionPage';

import './App.css';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
 //console.log{'App')
  return (
    <Contexts>
      <Router>
        <Navbar/>
        <div className="container">
          <Alert/>
          <Switch>
            <Route exact path='/register' component={Register}/>
            <Route exact path='/about' component={About}/>
            <Route exact path='/login' component={Login}/>
            <PrivateRoute exact path='/user' component={UserPage}/>
            <PrivateRoute exact path='/' component={Home}/>
            <PrivateRoute exact path='/goalform' component={GoalForm}/>
            <PrivateRoute exact path='/goal' component={GoalPage}/>
            <PrivateRoute exact path='/search' component={SearchPage}/>
            <PrivateRoute exact path='/friend' component={FriendPage}/>
            <PrivateRoute exact path='/friend/goal' component={FriendGoalPage}/>
            <PrivateRoute exact path='/competitionform' component={CompetitionForm}/>
            <PrivateRoute path='/competition' component={CompetitionPage}/>
            <Route component={NotFound}/>
          </Switch>
        </div>
      </Router>
    </Contexts>
  );
};

export default App;