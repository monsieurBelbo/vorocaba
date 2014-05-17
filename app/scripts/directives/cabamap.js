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

                var fill = d3.scale.category10();

                var projection = d3.geo.mercator()
                    .scale(190000)
                    .center([-58.40000,-34.58900])

                var path = d3.geo.path()
                    .projection(projection)
                    .pointRadius(3);

                var voronoi = d3.geom.voronoi();

                var svg = d3.select("#map").append("svg")
                    .attr("width", width)
                    .attr("height", height);

                $q.all([
                    $http.get("/data/caba.json"),
                    $http.get("/data/comisarias.csv")
                ]).then(ready)

                function ready(response) {
                    var caba = response[0].data,
                        contenedores = d3.csv.parse(response[1].data),
                        coordinates = contenedores.map(function(d) { return [+d.longitude, +d.latitude]; });

                    var defs = svg.append("defs");

                    defs.append("path")
                        .datum(topojson.feature(caba, caba.objects.limites))
                        .attr("id", "limits")
                        .attr("d", path);

                    defs.append("clipPath")
                        .attr("id", "clip")
                        .append("use")
                        .attr("xlink:href", "#limits");

                    svg.append("use")
                        .attr("xlink:href", "#limits")
                        .attr("class", "limits");

                    svg.append("path")
                        .datum(topojson.mesh(caba, caba.objects.barrios))
                        .attr("class", "subunit")
                        .attr("d", path)

                    svg.append("path")
                        .datum({type: "MultiPoint", coordinates: coordinates})
                        .attr("class", "points")
                        .attr("d", path)

                    var voronoiLayer = svg.append("g")
                        .attr("class", "land")
                        .attr("clip-path", "url(#clip)")

                    voronoiLayer.selectAll(".voronoi")
                        .data(voronoi(coordinates.map(projection)))
                        .enter().append("path")
                        .attr("class", "voronoi")
                        .style("fill", function(d,i) { return fill(i) })
                        .attr("d", polygon)
                }

                function polygon(d) {
                    return "M" + d.join("L") + "Z";
                }
            }
        };
    });
