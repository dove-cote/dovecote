import React, { Component } from 'react';
import $ from 'jquery';
import drawData from './draw_data';

var mockData = {
	nodes:[
		{ id: '0ca93294-f164-4cdc-ad23-04f0191d93b1',
		  name: 'Subtraction Responder' },
		{ id: 'c1f400fd-9d83-4265-9f20-9c02306af512',
		  name: 'Division Responder' },
		{ id: 'bc239b69-6f33-49b1-8314-5c38dd6f5fd1',
		  name: 'Multiplication Responder' },
		{ id: '5d4244c2-b6a5-40dd-a22a-629cd170cd80',
		  name: 'Subtraction Responder' },
		{ id: '2d0a4164-7f59-45ee-90cc-5c85d020b431',
		  name: 'sockend' },
		{ id: '0468b493-dd8a-4902-9e42-599999af287f',
		  name: 'Calculation Responder' },
		{ id: '2399f43f-98f0-45cf-af52-4aa386ec04a5',
		  name: 'sockendReq' },
		{ id: '8377d30a-21d0-424c-a858-e95e5feca199',
		  name: 'Addition Requester' },
		{ id: '317c464b-6998-4146-9bce-69428a47728a',
		  name: 'Subtraction Requester' },
		{ id: '1ad3d1f7-d4c9-462e-9640-fc72e419156d',
		  name: 'Multiplication Requester' },
		{ id: '300241e3-838b-4a73-bc96-4c73f86eef8d',
		  name: 'Division Requester' },
		{ id: '5e18c24c-034c-4540-817b-ccf6f1cbee44',
		  name: 'Addition Responder' }
	],
	links:[
		{ source: 10, target: 1 },
		{ source: 6, target: 5 },
		{ source: 7, target: 11 },
		{ source: 8, target: 3 },
		{ source: 9, target: 2 },
		{ source: 8, target: 0 }
	]
};

var convertDataToImportData = function (data) {
    data.links.forEach(function (link) {
        data.nodes[link.source].imports = data.nodes[link.source].imports || [];
        data.nodes[link.source].imports.push(data.nodes[link.target].name);
    });

    return data.nodes;

};


var CircleGraph = React.createClass({
	getData() {
        var x = convertDataToImportData(this.state.data)
		return x;
	},

    fetchData: function () {
        $.ajax({
            url: '/api/projects/' + this.props.projectId + '/status',
            success: function (data) {
                this.setState({data: String(data)});
                this.drawData();
            }.bind(this)
        })
    },

    componentDidMount() {
        this._interval = setInterval(this.fetchData, 5000);
        this.fetchData();
        this.drawData();
    },

    getInitialState() {
        return {data: mockData};
    },

    componentWillUnmount() {
        window.clearInterval(this._interval);
    },


	componentUpdate() {
        this.drawData();
    },

    drawData() {
	    var data = this.getData();
        drawData(data, this.container);
    },

	render() {
        return (
        	<div className='pure-u-2-3'>
              <h2>Live Dependency Graph</h2>
              <div ref={(ref) => this.container = ref}></div>
        </div>
    );

}

                                   });

export default CircleGraph;
