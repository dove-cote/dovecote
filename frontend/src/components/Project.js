
import React from 'react';

import {screen1, screen2} from '../mock';
import ProjectView from './ProjectView';

var Project = React.createClass({

    render() {
  	let {palette, projects} = screen1;

        return <ProjectView palette={palette} project={projects[0]} />;
    }

});


export default Project;
