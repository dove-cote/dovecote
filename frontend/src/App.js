import React, { Component } from 'react';

import ProjectView from './components/ProjectView';
import {screen1, screen2} from './mock';
import styles from './App.module.css';

var App = React.createClass({

    render() {
    	let {palette, projects} = screen1;
        return (
            <div className={styles.container}>
                <ProjectView palette={palette}
                			 project={projects[0]} />
            </div>
        );
    }

});

module.exports = App;
