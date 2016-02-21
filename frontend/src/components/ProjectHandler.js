import React from 'react';
import _ from 'lodash';
import ProjectView from './ProjectView';
import { browserHistory } from 'react-router';
import Immutable from 'immutable';

const {fromJS, Map, List} = Immutable;

var ProjectHandler = React.createClass({
    backToProjects() {
        browserHistory.push('/projects/');
    },

    componentWillMount() {
        this.props.store.fetchProjectById(this.props.params.id);
        this.onSync = _.debounce(this.onSync.bind(this), 500);
    },

    fillReadonlyComponentFields(currentService, receivedService) {
        let mutated = false;

        currentService.components.forEach((component, componentIndex) => {
            let receivedComponent = receivedService.components[componentIndex];
            if (!component._id) {
                component._id = receivedComponent._id;
                component.updatedAt = receivedComponent.updatedAt;
                component.createdAt = receivedComponent.createdAt;
                component.key = receivedComponent.key;
                mutated = true;
            }
        });

        return mutated;
    },

    fillReadonlyServiceFields(currentProject, receivedProject) {
        let project = currentProject.toJS();
        let mutated = false;

        project.services.forEach((service, index) => {
            let receivedService = receivedProject.services[index];
            if (!service._id) {
                service._id = receivedService._id;
                service.updatedAt = receivedService.updatedAt;
                service.createdAt = receivedService.createdAt;
                mutated = true;
            } else {
                mutated = this.fillReadonlyComponentFields(service, receivedService);
            }
        });

        if (mutated) {
            this.props.store.updateProject(fromJS(project), false);
        }
    },

    onSync(project) {
        this.props.store.saveProject(
            project,
            this.fillReadonlyServiceFields.bind(this, project)
        );
    },

    render() {
        let {store, params} = this.props;

        return (
            <ProjectView
                onSync={this.onSync}
                store={store}
                projectId={params.id} />
        );
    }

});


export default ProjectHandler;
