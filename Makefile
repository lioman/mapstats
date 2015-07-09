build/ne_10m_admin_0_countries.zip:
	mkdir -p $(dir $@)
	curl -v -L -o $@ http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/cultural/$(notdir $@)
	#curl -v -L -o $@ http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/cultural/$(notdir $@)

build/ne_10m_admin_0_map_subunits.shp: build/ne_10m_admin_0_countries.zip
	unzip -o $(dir $@)ne_10m_admin_0_countries.zip -d 'build'

build/subunits.json: build/ne_10m_admin_0_map_subunits.shp
	rm -f @1
	ogr2ogr -f GeoJSON -where "ADM0_A3 in ('AUT', 'BEL', 'BGR','CYP', 'CZE', 'DNK', 'EST',	'FIN', 'FRA', 'DEU', 'GRC', 'HUN', 'IRL', 'ITA', 'LVA', 'LTU', 'LUX', 'MLT', 'NLD', 'POL', 'PRT', 'ROU', 'SVK', 'SVN', 'ESP', 'SWE', 'GBR')" $@ $(dir $@)ne_10m_admin_0_countries.shp

build/eu.json: build/subunits.json
	node_modules/topojson/bin/topojson -o $@ --id-property SU_A3 --properties name=NAME -- $(dir $@)subunits.json
