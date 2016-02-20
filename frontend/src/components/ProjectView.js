import React, { Component } from 'react';
import _ from 'lodash';

import DesignView from './DesignView';
import MonitorView from './MonitorView';

import styles from './ProjectView.module.css';


var ProjectView = React.createClass({

    render() {
        var {projectId, store} = this.props;
        return (
            <div className={styles.projectView}>
                <div className={styles.sidebar}>Sidebar</div>
                <div className={styles.designArea}>
                    <DesignView store={store} projectId={projectId} />
                </div>
            </div>
        );
    }

});

export default ProjectView;