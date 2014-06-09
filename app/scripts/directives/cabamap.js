'use strict';

angular.module('vorocabaApp')
    .directive('cabaMap', function ($http, $q) {
        return {
            template: '<div></div>',
            restrict: 'E',
            link: function postLink(scope, element, attrs) {

                element.append('<div id="map"></div>');

                var width = attrs.width,
                    height = attrs.height;

                var fill = d3.scale.linear()
                    .domain([0, 10000])
                    .range(["#f00","#fff"]);

                var projection = d3.geo.mercator()
                    .scale(190000)
                    .center([-58.40000,-34.58900])

                var path = d3.geo.path()
                    .projection(projection)
                    .pointRadius(1.5);

                var voronoi = d3.geom.voronoi();

                var svg = d3.select("#map").append("svg")
                    .attr("width", width)
                    .attr("height", height);

                var exterior;

                scope.redraw = function() {
                    svg.selectAll(".points").remove();
                    svg.selectAll(".voronoi").remove();
                    $q.all([
                            $http.get(scope.dataset.url)
                        ]).then(function(response) {
                            drawVoronoi(scope.dataset.parse(response[0].data))
                        });
                }

                $q.all([
                        $http.get("data/caba.json")
                    ]).then(function(response) {
                        ready(response[0].data)
                    })

                function ready(caba) {
                    var limits = topojson.feature(caba, caba.objects.limites);

                    exterior = projectLineString(limits, projection);

                    svg.append("path")
                        .datum(limits)
                        .attr("class", "limits")
                        .attr("d", path);

                    svg.append("path")
                        .datum(topojson.mesh(caba, caba.objects.barrios))
                        .attr("class", "subunit")
                        .attr("d", path);
                }

                function drawVoronoi(points) {
                    var coordinates = points.map(function(d) { return [+d[scope.dataset.long], +d[scope.dataset.lat]]; });

                    svg.append("path")
                        .datum({type: "MultiPoint", coordinates: coordinates})
                        .attr("class", "points")
                        .attr("d", path)

                    if (scope.dataset.voronoi) {
                        svg.append("g")
                            .attr("class", "land")
                            .selectAll(".voronoi")
                            .data(voronoi(coordinates.map(projection)).map(function(d) {
                                // Each voronoi region is a convex polygon, therefore we can use
                                // d3.geom.polygon.clip, treating each regino as a clip region, with the
                                // projected “exterior” as a subject polygon.
                                return d3.geom.polygon(d).clip(exterior.slice());
                            }))
                            .enter().append("path")
                            .attr("class", "voronoi")
                            .style("fill", function(d) { return fill(Math.abs(d3.geom.polygon(d).area())); })
                            .attr("d", polygon);
                    }
                }

                function polygon(d) {
                    return "M" + d.join("L") + "Z";
                }

                // Extracts a single LineString from the given feature, projected (and resampled) using the given projection.
                // by @jasondavies
                function projectLineString(feature, projection) {
                    var line;
                    d3.geo.stream(feature, projection.stream({
                        polygonStart: noop,
                        polygonEnd: noop,
                        lineStart: function() { line = []; },
                        lineEnd: noop,
                        point: function(x, y) { line.push([x, y]); },
                        sphere: noop
                    }));
                    return line;
                }

                function noop() {}
            }
        };
    });
