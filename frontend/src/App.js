import React, { Component } from 'react';

import {screen1, screen2} from './mock';
import styles from './App.module.css';
import ProjectView from './components/ProjectView';


var App = React.createClass({

    render() {
        console.log('test', ProjectView)
        return <div className={styles.container}>
            <ProjectView data={screen1}/>
        </div>;

    }

});


module.exports = App;
