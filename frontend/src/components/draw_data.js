import d3 from 'd3';

export default function drawData(data, container) {
    var diameter = 640,
        radius = diameter / 2,
        innerRadius = radius - 120;

    var cluster = d3.layout.cluster()
        .size([360, innerRadius])
        .sort(null)
        .value(function(d) { return d.size; });

    var bundle = d3.layout.bundle();

    var line = d3.svg.line.radial()
        .interpolate("bundle")
        .tension(.85)
        .radius(function(d) { return d.y; })
        .angle(function(d) { return d.x / 180 * Math.PI; });

    var svg = d3.select(container).append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
        .append("g")
        .attr("transform", "translate(" + radius + "," + radius + ")");


    //  if (error) throw error;

    var nodes = cluster.nodes(packageHierarchy(data)),
        links = packageImports(nodes);

    svg.selectAll(".link")
        .data(bundle(links))
        .enter().append("path")
        .attr("class", "link")
        .attr("d", line);

    svg.selectAll(".node")
        .data(nodes.filter(function(n) { return !n.children; }))
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
        .append("text")
        .attr("dx", function(d) { return d.x < 180 ? 8 : -8; })
              .attr("dy", ".31em")
              .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
                    .attr("transform", function(d) { return d.x < 180 ? null : "rotate(180)"; })
                          .text(function(d) { return d.key; });


                          d3.select(self.frameElement).style("height", diameter + "px");

                          // Lazily construct the package hierarchy from class names.
                          function packageHierarchy(classes) {
                              var map = {};

                              function find(name, data) {
                                  var node = map[name], i;
                                  if (!node) {
                                      node = map[name] = data || {name: name, children: []};
                                      if (name.length) {
                                          node.parent = find(name.substring(0, i = name.lastIndexOf(".")));
                                          node.parent.children.push(node);
                                          node.key = name.substring(i + 1);
                                      }
                                  }
                                  return node;
                              }

                              classes.forEach(function(d) {
                                  find(d.name, d);
                              });

                              return map[""];
                          }

                          // Return a list of imports for the given array of nodes.
                          function packageImports(nodes) {
                              var map = {},
                              imports = [];

                              // Compute a map from name to node.
                              nodes.forEach(function(d) {
                                  map[d.name] = d;
                              });

                              // For each import, construct a link from the source to target node.
                              nodes.forEach(function(d) {
                                  if (d.imports) d.imports.forEach(function(i) {
                                      imports.push({source: map[d.name], target: map[i]});
                                  });
                              });

                              return imports;
                          }



                         }
