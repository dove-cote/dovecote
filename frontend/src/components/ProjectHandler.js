import React from 'react';
import ProjectView from './ProjectView';
import { browserHistory } from 'react-router'

var ProjectHandler = React.createClass({

    backToProjects() {
        browserHistory.push('/projects/');
    },
    render() {
        let {store, params} = this.props;

        return (
            <ProjectView
                store={store}
                projectId={parseInt(params.id)} />
        );
    }

});


export default ProjectHandler;
