Voro CABA
=========

Diagrama de Voronoi sobre D3.js optimizado para los límites geográficos de la Ciudad Autónoma de Buenos Aires.

## Requerimientos

#### Mapas
Requiere GDAL para convertir Shapefiles a GEOJSON y luego TopoJSON.

```
brew update
brew install gdal
npm install -g topojson
```
#### Frontend
Requiere Node. Grunt y Bower instalados via NPM.

## Instalación

```
grunt serve
```