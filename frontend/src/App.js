import React, { Component } from 'react';

import ProjectView from './components/ProjectView';
import {screen1, screen2} from './mock';
import styles from './App.module.css';

var App = React.createClass({

    render() {
        return (
            <div className={styles.container}>
                <ProjectView data={screen1}/>
            </div>
        );
    }

});

module.exports = App;
