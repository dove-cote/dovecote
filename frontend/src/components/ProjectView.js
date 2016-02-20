import React, { Component } from 'react';
import _ from 'lodash';

import DesignView from './DesignView';
import MonitorView from './MonitorView';

import styles from './ProjectView.module.css';
import { browserHistory } from 'react-router';


var ProjectView = React.createClass({
    backToProjects(event) {
        event.preventDefault();

        browserHistory.push('/projects/');
    },

    render() {
        var {projectId, store} = this.props;
        return (
            <div className={styles.projectView}>
                <div className={styles.sidebar}>
                    <a onClick={this.backToProjects}>Back to Projects</a>
                </div>
                <div className={styles.designArea}>
                    <DesignView store={store} projectId={projectId} />
                </div>
            </div>
        );
    }

});

export default ProjectView;
