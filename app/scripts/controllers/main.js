'use strict';

angular.module('vorocabaApp')
    .controller('MainCtrl', function ($scope) {
        $scope.datasets = [
            {
                name: "Comisarias",
                url: "/data/comisarias.csv",
                parse: d3.csv.parse,
                lat: "latitude",
                long: "longitude",
                voronoi: true
            },
            {
                name: "Campanas",
                url: "/data/campanas.csv",
                parse: d3.csv.parse,
                lat: "lat",
                long: "long",
                voronoi: false
            },
            {
                name: "Contenedores",
                url: "/data/contenedores.csv",
                parse: d3.csv.parse,
                lat: "lat",
                long: "long",
                voronoi: false
            },
            {
                name: "Bicicleterías",
                url: "/data/bicicleterias.csv",
                parse: d3.csv.parse,
                lat: "latitude",
                long: "longitude",
                voronoi: true
            },
            {
                name: "Bomberos",
                url: "/data/bomberos.csv",
                parse: d3.csv.parse,
                lat: "latitude",
                long: "longitud",
                voronoi: true
            }
        ]

        $scope.$watch("dataset", function(newValue, oldValue) {
            if (newValue) { $scope.redraw(); }
        })
    });
