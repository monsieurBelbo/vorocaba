barrios.zip:
	curl -o barrios.zip 'https://recursos-data.buenosaires.gob.ar/ckan2/barrios/barrios.zip'

barrios.shp: barrios.zip
	unzip barrios.zip
	touch barrios.shp

barrios.json: barrios.shp
	ogr2ogr -t_srs EPSG:4326 -f GeoJSON barrios.json barrios.shp

caba.json: barrios.json
	topojson -p -o caba.json barrios.json
	mv caba.json app/data
	rm barrios.*