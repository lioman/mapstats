build/ne_10m_admin_0_countries.zip:
	mkdir -p $(dir $@)
	curl -v -L -o $@ http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/cultural/$(notdir $@)

build/ne_10m_admin_0_countries.shp: build/ne_10m_admin_0_countries.zip
	unzip -o $< -d $(dir $@)
	
build/subunits.json: build/ne_10m_admin_0_countries.shp
	rm -f $@
	ogr2ogr -f GeoJSON -clipsrc -26.7 35.6 42.7 71.9  $@ $<
	#-where "ADM0_A3 in ('AUT', 'BEL', 'BGR','CYP', 'CZE', 'DNK', 'EST',	'FIN', 'FRA', 'DEU', 'GRC', 'HUN', 'IRL', 'ITA', 'LVA', 'LTU', 'LUX', 'MLT', 'NLD', 'POL', 'PRT', 'ROU', 'SVK', 'SVN', 'ESP', 'SWE', 'GBR', 'CHE', 'CRO', 'NOR', 'ALB', 'MNE', 'MKD', 'SVN', 'SRB', 'HRV', 'RSK', 'BIH')" $@ $<

build/europe.json: build/subunits.json
	rm -f $@
	node_modules/topojson/bin/topojson -o $@ --id-property WB_A2 --properties name=NAME -- $< 

build/eu.json: build/europe.json
	rm -f $@
	node_modules/topojson/bin/topojson -e ttr00012.csv -id-property='id,id' -p name=name -p pax2014=+pax2014 -p pax2013=+pax2013 -p pax2012=+pax2012 -p pax2011=+pax2011 -p pax2010=+pax2010 -p pax2009=+pax2009 -p pax2008=+pax2008 -p pax2007=+pax2007 -p pax2006=+pax2006 -p pax2005=+pax2005 -p pax2004=+pax2004 -o $@ -- $<
