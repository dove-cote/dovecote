'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect(process.env.DOVECOTE_MONGO || 'mongodb://mongo/dovecote');

mongoose.connection.on(
    'error',
    console.error.bind(console, 'Mongo connection error')
);

mongoose.connection.once('open', function() {
    console.log('Connected to mongo');
});


const monitorRecordSchema = new Schema({
    nodes: [{type: Schema.Types.Mixed}],
    links: [{type: Schema.Types.Mixed}],
    project: {type: Schema.Types.ObjectId, ref: 'Project'}
}, {timestamps: true});


const MonitorRecord = mongoose.model('MonitorRecord', monitorRecordSchema);




var cote = require('cote', {multicast: '239.1.1.1'});
var _ = require('lodash');

var monitor = new cote.Monitor({
    name: 'monitor'
}, {disableScreen: true});

var graph = {
    nodes: [],
    links: []
};

var rawLinks = {};

monitor.on('status', function(status) {
    var node = monitor.discovery.nodes[status.id];
    if (!node) return;

    rawLinks[status.id] = {
        source: status.id,
        target: status.nodes
    };
});

setInterval(function() {
    graph.nodes = _.map(monitor.discovery.nodes, function(node) {
        return {
            id: node.id,
            name: node.advertisement.name
        }
    });

    var indexMap = {};
    graph.nodes.forEach(function(node, index) {
        indexMap[node.id] = index;
    });

    var links = _.map(rawLinks, function(rawLink) {
        return rawLink.target.map(function(target) {
            return { // flip source & target for semantics :)
                source: indexMap[target],//monitor.discovery.nodes[target].advertisement.name + '#' + target,
                target: indexMap[rawLink.source]//monitor.discovery.nodes[rawLink.source].advertisement.name + '#' + rawLink.source
            };
        });
    });

    graph.links = _.flatten(links);
    graph.project = process.env.DOVECOTE_PROJECT;


    MonitorRecord.findOneAndUpdate({project: graph.project}, graph, {upsert: true}).exec();
}, 5000);
