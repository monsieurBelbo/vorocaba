"use strict";angular.module("vorocabaApp",["ngCookies","ngResource","ngSanitize","ngRoute"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("vorocabaApp").controller("MainCtrl",["$scope",function(a){a.datasets=[{name:"Comisarias",url:"/data/comisarias.csv",parse:d3.csv.parse,lat:"latitude","long":"longitude",voronoi:!0},{name:"Campanas",url:"/data/campanas.csv",parse:d3.csv.parse,lat:"lat","long":"long",voronoi:!1},{name:"Contenedores",url:"/data/contenedores.csv",parse:d3.csv.parse,lat:"lat","long":"long",voronoi:!1},{name:"Bicicleterías",url:"/data/bicicleterias.csv",parse:d3.csv.parse,lat:"latitude","long":"longitude",voronoi:!0},{name:"Bomberos",url:"/data/bomberos.csv",parse:d3.csv.parse,lat:"latitude","long":"longitud",voronoi:!0},{name:"Hospitales",url:"/data/hospitales.csv",parse:d3.csv.parse,lat:"latitude","long":"longitude",voronoi:!0}],a.$watch("dataset",function(b){b&&a.redraw()})}]),angular.module("vorocabaApp").directive("cabaMap",["$http","$q",function(a,b){return{template:"<div></div>",restrict:"E",link:function(c,d,e){function f(a){var b=topojson.feature(a,a.objects.limites);k=i(b,o),r.append("path").datum(b).attr("class","limits").attr("d",p),r.append("path").datum(topojson.mesh(a,a.objects.barrios)).attr("class","subunit").attr("d",p)}function g(a){var b=a.map(function(a){return[+a[c.dataset.long],+a[c.dataset.lat]]});r.append("path").datum({type:"MultiPoint",coordinates:b}).attr("class","points").attr("d",p),c.dataset.voronoi&&r.append("g").attr("class","land").selectAll(".voronoi").data(q(b.map(o)).map(function(a){return d3.geom.polygon(a).clip(k.slice())})).enter().append("path").attr("class","voronoi").style("fill",function(a){return n(Math.abs(d3.geom.polygon(a).area()))}).attr("d",h)}function h(a){return"M"+a.join("L")+"Z"}function i(a,b){var c;return d3.geo.stream(a,b.stream({polygonStart:j,polygonEnd:j,lineStart:function(){c=[]},lineEnd:j,point:function(a,b){c.push([a,b])},sphere:j})),c}function j(){}d.append('<div id="map"></div>');var k,l=e.width,m=e.height,n=d3.scale.linear().domain([0,1e4]).range(["#f00","#fff"]),o=d3.geo.mercator().scale(19e4).center([-58.4,-34.589]),p=d3.geo.path().projection(o).pointRadius(1.5),q=d3.geom.voronoi(),r=d3.select("#map").append("svg").attr("width",l).attr("height",m);c.redraw=function(){r.selectAll(".points").remove(),r.selectAll(".voronoi").remove(),b.all([a.get(c.dataset.url)]).then(function(a){g(c.dataset.parse(a[0].data))})},b.all([a.get("/data/caba.json")]).then(function(a){f(a[0].data)})}}}]);