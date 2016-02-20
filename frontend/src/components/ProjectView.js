import React, { Component } from 'react';

import DesignView from './DesignView';
import MonitorView from './MonitorView';

import styles from './ProjectView.module.css';


var ProjectView = React.createClass({

    render() {
	    var data = this.props.data;
	    return (
	    	<div className={styles.projectView}>
		        <div className={styles.sidebar}>Sidebar</div>
		    	<div className={styles.designArea}>
		    		<DesignView data={data}/>
		    	</div>
		    </div>
	    );
    }

});

export default ProjectView;