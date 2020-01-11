import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Home from './components/pages/Home';
import About from './components/pages/About';
import NotFound from './components/pages/NotFound';
import Navbar from './components/layout/Navbar';
import GoalItem from './components/goals/GoalItem';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
// import Alert from './components/alerts/Alert';
import GoalState from './contexts/goals/goalState';
// import AuthState from './contexts/auth/authState';
// import AlertState from './contexts/alerts/alertState';
// import CompetitionState from './contexts/competitions/competitionState';
// import setAuthToken from './utils/setAuthToken';
//import PrivateRoute from './components/routing/PrivateRoute';

import './App.css';
import 'materialize-css/dist/css/materialize.min.css'
//if you want to use materialize JS
// import M from 'materialize-css/dist/js/materialize.min.js'

function App() {
  /* if you want to use materialize JS
    useEffect(() => {
      M.AutoInit();
    })
  */
  return (
    <GoalState>
      <Router>
        <React.Fragment>
          <Navbar />
          <div className="container">
            <Switch>
              <Route exact path='/register' component={Register} />
              <Route exact path='/login' component={Login} />
              <Route exact path='/' component={Home}/>
              <Route exact path='/about' component={About}/>
              <Route exact path='/goal/:id' component={GoalItem}/>
              <Route component={NotFound}/>
            </Switch>
          </div>
        </React.Fragment>
      </Router>
    </GoalState>
  );
}

export default App;