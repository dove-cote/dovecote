import React from 'react';
import _ from 'lodash';
import ProjectView from './ProjectView';
import { browserHistory } from 'react-router';
import Immutable from 'immutable';

const {fromJS, Map, List} = Immutable;

var MonitorHandler = React.createClass({
    render() {
        let {store, params} = this.props;

        return (
            <ProjectView
                currentView='monitor'
                store={store}
                projectId={params.id} />
        );
    }

});


export default MonitorHandler;
