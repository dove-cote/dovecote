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

        var deployment = store.getProjectDeployment();

        var deployInfoStyle = {
            padding: 30
        }

        if (deployment.get('inProgress')) {
            return <div style={deployInfoStyle}>Reticulating Splines. Build in Progress. Please wait. This could take up to 15 seconds.</div>;
        }


        if (deployment.get('deployed') && !deployment.get('continueAfterDeploy')) {
            return <div style={deployInfoStyle}>
                <p>Project Deployed Successfully!</p>
                <button className='pure-button pure-button-primary' style={{marginRight: 20}} onClick={store.test}>Test Service</button>
                <button className='pure-button' onClick={store.continueAfterDeploy}>Continue</button>
                </div>;
        }


        if (deployment.get('error') && !deployment.get('continueAfterDeploy')) {
            return <div style={deployInfoStyle}>
                <p>Error Deploying the Project. {deployment.get('errorText')}</p>
                <button className='pure-button' onClick={store.continueAfterDeploy}>Continue</button>
                </div>;
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
