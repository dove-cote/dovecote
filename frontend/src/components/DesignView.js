import React, { Component } from 'react';

import Canvas from './Canvas';
import Palette from './Palette';

var icon = <g><path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6h-2v-13h-6v-2h18v2z"></path></g>

var Toolbar = React.createClass({

    render() {
        return (
            <div>
                Add a Service <svg viewBox="0 0 24 24" width="24" preserveAspectRatio="xMidYMid meet" fit>{icon}</svg>
                Deploy
            </div>
        );

    }

});

var DesignView = React.createClass({

    render() {
        return (
            <div>
                <Canvas data={this.props.data.project}/>
                <Palette data={this.props.data.palette}/>
                <Toolbar/>
            </div>
        );

    }

});

export default DesignView;