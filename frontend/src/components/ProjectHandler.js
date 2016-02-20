
import React from 'react';

import ProjectView from './ProjectView';

var ProjectHandler = React.createClass({

    render() {
        let {store, params} = this.props;

        return (
            <ProjectView store={store}
                         projectId={parseInt(params.id)} />
        );
    }

});


export default ProjectHandler;
