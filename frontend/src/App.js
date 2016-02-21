import React, { Component } from 'react';
import ProjectView from './components/ProjectView';

import store from './store';

import styles from './App.module.css';
require('./App.less');
require('./components/Buttons.less');

window.__STORE__ = store;



var UserInfo = React.createClass({

    render() {
        var {email, username} = this.props.user;

        return <div className="">
            {email ? <div>logged in as: {username} <a className='pure-button' href='/logout'>Logout</a></div>:<div>Not logged in <a href='/login'>Login</a>  </div>}
        </div>;

    }

});


var Header = React.createClass({

    render() {
        var user = store.getUser().toJS();
        return <header className='top-header'>
            <h1>DoveCote</h1>
              {user.initialized && <div className='user-container'><UserInfo user={user}/></div>}
        </header>;

    }

});


var App = React.createClass({

	update() {
		this.setState({
			projects: store.getProjects()
		});
	},

	componentDidMount() {
		store.addListener(this.update);
        store.fetchUser();
	},


	componentWillUnmount() {
		store.removeListener(this.updateCallback);
	},

    render() {

    	return (
            <div className={styles.container}>
              <Header/>


              {React.cloneElement(
              	this.props.children,
              	{
              		store
              	}
              )}
            </div>
        );
    }

});

module.exports = App;
