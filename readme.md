Voro CABA
=========

Diagrama de Voronoi sobre D3.js optimizado para los límites geográficos de la Ciudad Autónoma de Buenos Aires.

![Imgur](http://i.imgur.com/JFzLUoR.png)

Para traer todas dependencias y correr localmente, desde el root:

```
npm install
bower install
grunt serve
```

Para regenerar el topojson de barrios y límites de la ciudad:

```
make caba.json
```

### Requerimientos

#### Webapp
* [node.js](http://nodejs.org/)
* [npm](https://www.npmjs.org/)
* [grunt](http://gruntjs.com/)

#### Mapas
* [GDAL](http://www.gdal.org/)
* [TopoJSON](http://www.gdal.org/)

Para instalar GDAL y TopoJSON (con brew y npm):

```
brew update
brew install gdal
npm install -g topojson
```