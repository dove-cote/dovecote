import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { render } from 'react-dom'
import { Router, Route, Link, browserHistory } from 'react-router'


import Projects from './components/Projects';
import Dashboard from './components/Dashboard';
import ProjectHandler from './components/ProjectHandler';
import MonitorHandler from './components/MonitorHandler';
import Login from './components/Login';
import LoginOrRegister from './components/LoginOrRegister';
import Register from './components/Register';
import Logout from './components/Logout';

require('./pure-min.css');

var NoMatch = React.createClass({

    render() {
        return <div className="">
            No match
        </div>;

    }

});


render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
    <Route path="dashboard" component={Dashboard}/>
    <Route path="projects" component={Projects}/>
    <Route path="project/:id" component={ProjectHandler}/>
    <Route path="project/:id/monitor" component={MonitorHandler}/>
    <Route path="login" component={LoginOrRegister}/>
    <Route path="register" component={LoginOrRegister}/>
    <Route path="logout" component={Logout}/>
    <Route path="*" component={NoMatch}/>
    </Route>
  </Router>
), document.getElementById('root'))
