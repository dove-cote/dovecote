import React from 'react';
import moment from 'moment';
import { browserHistory } from 'react-router'
import _ from 'lodash';

var Projects = React.createClass({

    componentWillMount() {
        this.props.store.fetchProjectSummaries();
    },

    navigateToProject(id) {
        browserHistory.push('/project/' + id);
    },

    render() {
        var renderProjectSummary = function (projectSummary) {
            return <li style={{cursor: 'pointer'}} key={projectSummary.id} onClick={_.partial(this.navigateToProject, projectSummary.id)}>{projectSummary.id} {projectSummary.name} {moment().fromNow(projectSummary.lastUpdated)}</li>;
        }.bind(this);
        const projectSummaries = this.props.store.getProjectSummaries().toJS();

        return <div className="">
                <h2>projects view</h2>

            {projectSummaries.inProgress ? 'loading' : <ul>{projectSummaries.data.map(renderProjectSummary)}</ul>}

        </div>;

    }

});


export default Projects;
