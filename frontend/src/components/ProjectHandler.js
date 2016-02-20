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
            <div>
              <div onClick={this.backToProjects}>Back to Projects</div>
              <ProjectView store={store}
                           projectId={parseInt(params.id)} />
            </div>
        );
    }

});


export default ProjectHandler;
