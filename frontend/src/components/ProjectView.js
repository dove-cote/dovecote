import React, { Component } from 'react';
import _ from 'lodash';

import DesignView from './DesignView';
import MonitorView from './MonitorView';

import styles from './ProjectView.module.css';
import { browserHistory } from 'react-router';


var ProjectView = React.createClass({
    render() {
        var {projectId, store} = this.props;
        return (
            <div className={styles.projectView}>
                <div className={styles.sidebar}>
                    <div className={styles.verticalTabs}>
                        <a href="#" 
                           className={`${styles.verticalTabTitle} ${styles.designerTab}`}>
                            Designer
                        </a>
                        <a href="#"
                            className={`${styles.verticalTabTitle} ${styles.monitorTab}`}>
                            Monitor
                        </a>
                    </div>
                </div>
                <div className={styles.designArea}>
                    <DesignView store={store} 
                                onSync={this.props.onSync}
                                projectId={projectId} />
                </div>
            </div>
        );
    }

});

export default ProjectView;
