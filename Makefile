build/ne_10m_admin_0_map_subunits.zip:
	mkdir -p $(dir $@)
	curl -v -L -o $@ http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/cultural/$(notdir $@)

build/ne_10m_admin_0_map_subunits.shp: build/ne_10m_admin_0_map_subunits.zip
	unzip $(dir $@)ne_10m_admin_0_map_subunits.zip -d 'build'

