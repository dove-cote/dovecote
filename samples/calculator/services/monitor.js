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
}, 5000);
