import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { render } from 'react-dom'
import { Router, Route, Link, browserHistory } from 'react-router'


import Projects from './components/Projects';
import Dashboard from './components/Dashboard';
import ProjectHandler from './components/ProjectHandler';
import Login from './components/Login';
import Register from './components/Register';
import Logout from './components/Logout';






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
    <Route path="login" component={Login}/>
    <Route path="register" component={Register}/>
    <Route path="logout" component={Logout}/>
    <Route path="*" component={NoMatch}/>
    </Route>
  </Router>
), document.getElementById('root'))


ReactDOM.render(<App />, );
