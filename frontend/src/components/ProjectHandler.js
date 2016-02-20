import React from 'react';
import ProjectView from './ProjectView';
import { browserHistory } from 'react-router'

var ProjectHandler = React.createClass({
    backToProjects() {
        browserHistory.push('/projects/');
    },

    componentWillMount() {
        this.props.store.fetchProjectById(this.props.params.id);
    },

    render() {
        let {store, params} = this.props;

        return (
            <ProjectView
                store={store}
                projectId={params.id} />
        );
    }

});


export default ProjectHandler;
