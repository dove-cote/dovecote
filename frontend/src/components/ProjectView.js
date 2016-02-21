import React, { Component } from 'react';
import _ from 'lodash';
import classNames from 'classnames';

import DesignView from './DesignView';
import MonitorView from './MonitorView';

import styles from './ProjectView.module.css';
import { browserHistory } from 'react-router';


var ProjectView = React.createClass({
    getDefaultProps() {
        return {
            currentView: 'designer'
        }
    },

    navigate(to) {
        var {projectId} = this.props;
        browserHistory.push(`/project/${projectId}/${to}`)
    },

    render() {
        var {projectId, store} = this.props;


        if (store.getProjectDeployment().get('inProgress')) {
            return <div>Build in Progress</div>;
        }


        var {projectId, store, currentView} = this.props;

        return (
            <div className={styles.projectView}>
                <div className={styles.sidebar}>
                    <div className={styles.verticalTabs}>
                        <a href="#"
                           onClick={this.navigate.bind(this, '')} 
                           className={classNames(
                                styles.verticalTabTitle, 
                                styles.designerTab, {
                                    [styles.currentTab]: currentView === 'designer'
                                })}>
                            Designer
                        </a>
                        <a href="#"
                           onClick={this.navigate.bind(this, 'monitor')} 
                            className={classNames(
                                styles.verticalTabTitle, 
                                styles.monitorTab, {
                                    [styles.currentTab]: currentView === 'monitor'
                                })}>
                            Monitor
                        </a>
                    </div>
                </div>
                <div className={styles.designArea}>
                    {
                        currentView === 'designer' ? (
                            <DesignView store={store} 
                                onSync={this.props.onSync}
                                projectId={projectId} />
                        ) : (
                            <MonitorView 
                                store={store}
                                projectId={projectId} />
                        )
                    }
                </div>
            </div>
        );
    }

});

export default ProjectView;
