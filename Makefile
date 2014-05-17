barrios.zip:
	curl -o barrios.zip 'https://recursos-data.buenosaires.gob.ar/ckan2/barrios/barrios.zip'

barrios.shp: barrios.zip
	unzip barrios.zip
	touch barrios.shp

barrios.json: barrios.shp
	ogr2ogr -t_srs EPSG:4326 -f GeoJSON barrios.json barrios.shp

limites.json:
	curl -o limites.json 'https://bahackaton.cartodb.com/api/v2/sql?filename=limites_caba&q=SELECT+*+FROM+limites_caba&format=geojson'

caba.json: barrios.json limites.json
	topojson -o caba.json barrios.json limites.json
	mv caba.json app/data