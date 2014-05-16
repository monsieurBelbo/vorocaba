'use strict';

angular.module('vonocabaApp')
    .directive('cabaMap', function () {
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

                queue()
                    .defer(d3.json, "/data/caba.json")
                    .defer(d3.csv, "/data/contenedores.csv")
                    .await(ready);

                function ready(error, caba, contenedores) {
                    var subunits = topojson.feature(caba, caba.objects.barrios);
                    console.log(caba);        //TODO(gb): Remove trace!!!

                    svg.append("path")
                        .datum(topojson.mesh(caba, caba.objects.barrios))
                        .attr("class", "subunit")
                        .attr("d", path)

                    svg.append("path")
                        .datum({type: "MultiPoint", coordinates: contenedores})
                        .attr("class", "points")
                        .attr("d", path)

                    svg.append("path")
                        .datum(d3.geom.voronoi(contenedores.map(projection)))
                        .attr("class", "voronoi")
                        .attr("d", function(d) { return "M" + d.map(function(d) { return d.join("L"); }).join("ZM") + "Z"; });

                }


            }
        };
    });
