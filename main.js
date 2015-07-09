function drawMap(year) {
    $('.map').empty();

    var paxYear = 'pax' + year;

    var width = 900,
        height = 600;

    var projection = d3.geo.mercator()
        .center([9, 55])
        .scale(500)
        .translate([width / 2, height / 2]);

    var path = d3.geo.path()
        .projection(projection)
        .pointRadius(2);

    var svg = d3.select('.map').append('svg')
        .attr('width', width)
        .attr('height', height);

    var radius = d3.scale.sqrt()
        .domain([0, 300000000])
        .range([0, 30]);

    var formatNumber = d3.format('>-,');

    d3.json('build/eu.json', function (error, eu) {
        if (error) return console.error(error);

        svg.append('path')
            .datum(topojson.feature(eu, eu.objects.subunits))
            .attr('d', path);

        //add classes
        svg.selectAll('.subunit')
            .data(topojson.feature(eu, eu.objects.subunits).features)
            .enter().append('path')
            .attr('class', function (d) {
                return 'subunit ' + d.id;
            })
            .attr('d', path);

        // Add Labels
        svg.selectAll('.subunit-label')
            .data(topojson.feature(eu, eu.objects.subunits).features)
            .enter().append('text')
            .attr('class', function (d) {
                return 'subunit-label ' + d.id;
            })
            .attr('transform', function (d) {
                return 'translate(' + path.centroid(d) + ')';
            })
            .attr('dy', '.35em')
            .text(function (d) {
                return d.properties.name;
            });


        svg.append('g')
            .attr('class', 'bubble')
            .selectAll('circle')
            .data(topojson.feature(eu, eu.objects.subunits).features
                .sort(function (a, b) {
                    return b.properties[paxYear] - a.properties[paxYear];
                }))
            .enter().append('circle')
            .attr('transform', function (d) {
                return 'translate(' + path.centroid(d) + ')';
            })
            .attr('r', function (d) {
                return radius(d.properties[paxYear]);
            })
            .append('title')
            .text(function (d) {
                return d.properties.name
                    + '\nPax in ' + year + ':  ' + formatNumber(d.properties[paxYear]);
            }).attr('class', 'bubbletext');


        var legend = svg.append('g')
            .attr('class', 'legend')
            .attr('transform', 'translate(' + (width - 50) + ',' + (height - 20) + ')')
            .selectAll('g')
            .data([3000000, 30000000, 300000000])
            .enter().append('g');

        legend.append('circle')
            .attr('cy', function (d) {
                return -radius(d);
            })
            .attr('r', radius);

        legend.append('text')
            .attr('y', function (d) {
                return -2 * radius(d);
            })
            .attr('dy', '1.3em')
            .text(d3.format('.1s'));

    });
}



function setYear(){
    drawMap($('#yearSlider').attr('data-slider'));
}