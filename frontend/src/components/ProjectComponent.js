import React, { Component } from 'react';

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

export default ProjectComponent