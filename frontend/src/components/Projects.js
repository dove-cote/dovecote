import React from 'react';
import moment from 'moment';
import { browserHistory } from 'react-router';
import _ from 'lodash';
import PromptDialog from './PromptDialog';

var Projects = React.createClass({

    getInitialState() {
        return {
            showNewProjectDialog: false
        };
    },

    componentWillMount() {
        this.props.store.fetchProjectSummaries();
    },

    navigateToProject(id) {
        browserHistory.push('/project/' + id);
    },

    createNewProject(name) {
        this.props.store.createNewProject(name, this.navigateToProject);
    },

    toggleState(key) {
        this.setState({
            [key]: !this.state[key]
        });
    },

    render() {
        var renderProjectSummary = function (projectSummary) {
            return <li style={{cursor: 'pointer'}} key={projectSummary._id} onClick={_.partial(this.navigateToProject, projectSummary._id)}>
                {projectSummary.name} Last updated: {moment(projectSummary.updatedAt).fromNow()} ago Created: {moment(projectSummary.createdAt).fromNow()}</li>;
        }.bind(this);
        const projectSummaries = this.props.store.getProjectSummaries().toJS();
        const projectCreation = this.props.store.getProjectCreation().toJS();

        return (
            <div className={''}>
                <h2>My Projects</h2>
                {projectSummaries.inProgress ?
                    'loading' : (
                        <ul>
                            {projectSummaries.data.map(renderProjectSummary)}
                        </ul>
                    )}

                <PromptDialog isOpen={this.state.showNewProjectDialog}
                              onSubmit={this.createNewProject}
                              onClose={this.toggleState.bind(this, 'showNewProjectDialog')}
                              title="Enter a project name" />

                <button onClick={this.toggleState.bind(this, 'showNewProjectDialog')}>
                    Create New Project
                </button>
            </div>
        );

    }

});


export default Projects;
