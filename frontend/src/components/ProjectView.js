import React, { Component } from 'react';

import DesignView from './DesignView';
import MonitorView from './MonitorView';

import styles from './ProjectView.module.css';


var ProjectView = React.createClass({

    render() {
	    var {palette, project} = this.props;
	    return (
	    	<div className={styles.projectView}>
		        <div className={styles.sidebar}>Sidebar</div>
		    	<div className={styles.designArea}>
		    		<DesignView palette={palette}
		    					project={project} />
		    	</div>
		    </div>
	    );
    }

});

export default ProjectView;