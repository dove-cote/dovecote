import React from 'react';
import moment from 'moment';
import { browserHistory } from 'react-router';
import _ from 'lodash';

var Projects = React.createClass({

    componentWillMount() {
        this.props.store.fetchProjectSummaries();
    },

    navigateToProject(id) {
        browserHistory.push('/project/' + id);
    },

    createNewProject() {
        this.props.store.createNewProject(this.navigateToProject);
    },


    render() {
        var renderProjectSummary = function (projectSummary) {
            return <li style={{cursor: 'pointer'}} key={projectSummary._id} onClick={_.partial(this.navigateToProject, projectSummary._id)}>{projectSummary.name} {moment().fromNow(projectSummary.lastUpdated)}</li>;
        }.bind(this);
        const projectSummaries = this.props.store.getProjectSummaries().toJS();
        const projectCreation = this.props.store.getProjectCreation().toJS();

        return <div className=''>
                <h2>projects view</h2>

            {projectSummaries.inProgress ? 'loading' : <ul>{projectSummaries.data.map(renderProjectSummary)}</ul>}


        <button onClick={this.createNewProject}>{projectCreation.inProgress ? 'Initializing, please wait...' : 'Create New Project'}</button>
        </div>;

    }

});


export default Projects;
