build/ne_10m_admin_0_countries.zip:
	mkdir -p $(dir $@)
	curl -v -L -o $@ http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/cultural/$(notdir $@)

build/ne_10m_admin_0_countries.shp: build/ne_10m_admin_0_countries.zip
	unzip -o $< -d $(dir $@)
	
build/countries.json: build/ne_10m_admin_0_countries.shp
	rm -f $@
	ogr2ogr -f GeoJSON -clipsrc -26.7 35.6 42.7 71.9  $@ $<

build/europe.json: build/countries.json
	rm -f $@
	node_modules/topojson/bin/topojson -o $@ --id-property WB_A2 --properties name=NAME -- $< 

build/eu_pax.json: build/europe.json
	rm -f $@
	node_modules/topojson/bin/topojson -e data/ttr00012.csv -id-property='id,id' \
	-p name=name -p pax2014=+pax2014 -p pax2013=+pax2013 -p pax2012=+pax2012 \
	-p pax2011=+pax2011 -p pax2010=+pax2010 -p pax2009=+pax2009 -p pax2008=+pax2008 \
	-p pax2007=+pax2007 -p pax2006=+pax2006 -p pax2005=+pax2005 -p pax2004=+pax2004 \
	-o $@ -- $<


build/eu_data.json: build/eu_pax.json
	rm -f $@
	node_modules/topojson/bin/topojson -e data/ttr00011.csv -id-property='id,id' \
	-p name=name -p pax2014=+pax2014 -p pax2013=+pax2013 -p pax2012=+pax2012 \
	-p pax2011=+pax2011	-p pax2010=+pax2010 -p pax2009=+pax2009 -p pax2008=+pax2008 \
	-p pax2007=+pax2007 -p pax2006=+pax2006 -p pax2005=+pax2005 -p pax2004=+pax2004 \
	-p goods2003=+goods2003 -p goods2004=+goods2004 -p goods2005=+goods2005 -p goods2006=+goods2006 \
	-p goods2007=+goods2007 -p goods2008=+goods2008 -p goods2009=+goods2009 -p goods2010=+goods2010 \
	-p goods2011=+goods2011 -p goods2012=+goods2012 -p goods2013=+goods2013 -p goods2014=+goods2014 \
	-o $@ -- $<
