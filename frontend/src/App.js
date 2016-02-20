import React, { Component } from 'react';

var {screen1, screen2} = require('./mock');

// case 'accessibility':
var icon = <g><path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6h-2v-13h-6v-2h18v2z"></path></g>




var ProjectView = React.createClass({

    render() {
        var data = this.props.data;
        return <div className="">
            Left sidebar

        <DesignView data={data}/>
        </div>;

    }

});



var Toolbar = React.createClass({

    render() {
        return <div className="">
Add a Service <svg viewBox="0 0 24 24" width="24" preserveAspectRatio="xMidYMid meet" fit>{icon}</svg>
Deploy
        </div>;

    }

});

var DesignView = React.createClass({

    render() {
        return <div className="">
            <Canvas data={this.props.data.project}/>
            <Palette data={this.props.data.palette}/>
            <Toolbar/>
        </div>;

    }

});


var MonitorView = React.createClass({

    render() {
        return <div className="">
            this is monitor view
        </div>;

    }

});


var ProjectComponent = React.createClass({

    render() {

        var renderComponentChild = function (componentChild) {
            return <div>a child {componentChild.name} {componentChild.type}</div>;
        };

        var {name, meta, code, children} = this.props.data;
        return <div className="">

        Name: {name}
        Meta:
{meta.position.x}
{meta.position.y}
        Code: {code}
        {children.map(renderComponentChild)}
        </div>;

    }

});


var Canvas = React.createClass({

    render() {
        var renderProjectComponent = function (item) {
            return <ProjectComponent data={item} />;
        };

        return <div className="">

        {this.props.data.map(renderProjectComponent)}
            this is the canvas
        </div>;

    }

});


var Palette = React.createClass({

    render() {
        var renderPaletteItem = function (item) {
            return <div>{item.type} {item.icon}</div>;
        }


        return <div className="">
            this is palette

        {this.props.data.map(renderPaletteItem)}
        </div>;

    }

});


var App = React.createClass({

    render() {
        return <div className="">
            <ProjectView data={screen1}/>
        </div>;

    }

});


module.exports = App;
