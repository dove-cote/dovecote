import React, { Component } from 'react';
import {screen1, screen2} from './mock';
import styles from './App.module.css';


var App = React.createClass({

    render() {
    	let {palette, projects} = screen1;
        return (
            <div className={styles.container}>
              {this.props.children}
            </div>
        );
    }

});

module.exports = App;
