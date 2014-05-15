'use strict';

angular.module('vonocabaApp')
    .directive('cabaMap', function () {
        return {
            template: '<div></div>',
            restrict: 'E',
            link: function postLink(scope, element, attrs) {

                element.append('<div id="map"></div>');

                var width = attrs.width,
                    height = attrs.height,
                    centered;

                var svg = d3.select("#map").append("svg")
                    .attr("width", width)
                    .attr("height", height);

                var projection = d3.geo.mercator()
                    .scale(190000)
                    .center([-58.40000,-34.58900])

                var path = d3.geo.path()
                    .projection(projection);

                svg.append("rect")
                    .attr("class", "background")
                    .attr("width", width)
                    .attr("height", height);

                var g = svg.append("g");

                d3.json("/data/caba.json", function(error, pal) {
                    var subunits = topojson.feature(pal, pal.objects.barrios);

                    g.append("g")
                        .datum(subunits)
                        .attr("d",path);

                    g.selectAll(".subunit")
                        .data(subunits.features)
                        .enter().append("path")
                        .attr("class", function(d) { return "subunit"; })
                        .attr("d", path)
                });
            }
        };
    });
