import React, { Component } from 'react';
import ProjectView from './components/ProjectView';

import store from './store';
import styles from './App.module.css';

window.__STORE__ = store;



var UserInfo = React.createClass({

    render() {
        var {email, username} = this.props.user;

        return <div className="">
            {email ? <div>logged in as: {username} <a href='/logout'>Logout</a></div>:<div>Not logged in <a href='/login'>Login</a>  </div>}
        </div>;

    }

});


var App = React.createClass({

	update() {
		this.setState({
			projects: store.getProjects()
		});
	},

	componentDidMount() {
		this.updateCallback = this.update.bind(this);
		store.addListener(this.updateCallback);
        store.fetchUser();
	},


	componentWillUnmount() {
		store.removeListener(this.updateCallback);
	},

    render() {
        var user = store.getUser().toJS();

    	return (
            <div className={styles.container}>
              {user.initialized && <UserInfo user={user}/>}

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
