'use strict';

angular.module('vonocabaApp')
    .directive('cabaMap', function ($http, $q) {
        return {
            template: '<div></div>',
            restrict: 'E',
            link: function postLink(scope, element, attrs) {

                element.append('<div id="map"></div>');

                var width = attrs.width,
                    height = attrs.height;

                var svg = d3.select("#map").append("svg")
                    .attr("width", width)
                    .attr("height", height);

                var projection = d3.geo.mercator()
                    .scale(190000)
                    .center([-58.40000,-34.58900])

                var path = d3.geo.path()
                    .projection(projection);

                $q.all([
                    $http.get("/data/caba.json"),
                    $http.get("/data/comisarias.csv")
                ]).then(ready)

                function ready(response) {
                    var caba = response[0].data,
                        contenedores = d3.csv.parse(response[1].data),
                        coordinates = contenedores.map(function(d) { return [+d.longitude, +d.latitude]; });

                    svg.append("path")
                        .datum(topojson.mesh(caba, caba.objects.barrios))
                        .attr("class", "subunit")
                        .attr("d", path)

                    svg.append("path")
                        .datum({type: "MultiPoint", coordinates: coordinates})
                        .attr("class", "points")
                        .attr("d", path)

                    svg.append("path")
                        .datum(d3.geom.voronoi(coordinates.map(projection)))
                        .attr("class", "voronoi")
                        .attr("d", function(d) { return "M" + d.map(function(d) { return d.join("L"); }).join("ZM") + "Z"; });

                }
            }
        };
    });
