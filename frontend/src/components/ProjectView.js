import React, { Component } from 'react';

import DesignView from './DesignView';
import MonitorView from './MonitorView';


var ProjectView = React.createClass({

    render() {
	    var data = this.props.data;
	    return (
	    	<div>
		        Left sidebar
		    	<DesignView data={data}/>
		    </div>
	    );
    }

});

export default ProjectView;