import React, { Component } from 'react';
import ProjectView from './components/ProjectView';

import store from './store';
import styles from './App.module.css';

window.__STORE__ = store;


var App = React.createClass({

	update() {
		this.setState({
			projects: store.getProjects()
		});
	},

	componentDidMount() {
		this.updateCallback = this.update.bind(this);
		store.addListener(this.updateCallback);
	},

	componentWillUnmount() {
		store.removeListener(this.updateCallback);
	},

    render() {
    	return (
            <div className={styles.container}>
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
