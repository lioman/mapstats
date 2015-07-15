function drawMap() {
    $('.map').empty();

    width = 650;
    height = 600;

    projection = d3.geo.mercator()
        .center([9, 55])
        .scale(460)
        .translate([width / 2, height / 2]);

    path = d3.geo.path()
        .projection(projection)
        .pointRadius(2);

    svg = d3.select('.map').append('svg')
        .attr('width', width)
        .attr('height', height);


    formatNumber = d3.format('>-,');

    d3.json('build/eu_data.json', function (error, eu) {
        if (error) return console.error(error);
        euJson = eu;


        svg.append('path')
            .datum(topojson.feature(eu, eu.objects.countries))
            .attr('d', path);

        //add classes
        svg.selectAll('.subunit')
            .data(topojson.feature(eu, eu.objects.countries).features)
            .enter().append('path')
            .attr('class', function (d) {
                if (d.id != -99) {
                    return 'subunit ' + d.id;
                }
                return 'subunit NO';
            })
            .attr('d', path);

        // Add Label
        svg.selectAll('.subunit-label')
            .data(topojson.feature(eu, eu.objects.countries).features)
            .enter().append('text')
            .attr('class', function (d) {
                if (d.id != -99) {
                    return 'subunit-label ' + d.id;
                }
                return 'subunit-label NO';
            })
            .attr('transform', function (d) {
                return 'translate(' + path.centroid(d) + ')';
            })
            .attr('dy', '.35em')
            .text(function (d) {
                return d.properties.name;
            });

        drawBubbles();
    });


}

function drawBubbles() {

    var year = $('#choosedYear').val(),
        type = $( "input:checked" ).val();
    var zoomRange = [0, 300000000];

    if (type === 'goods') {
        zoomRange = [0, 4300000];
    }

    var radius = d3.scale.sqrt()
        .domain(zoomRange)
        .range([0, 30]);

    $('.bubble').empty();
    $('.legend').empty();

    var bubbleClass = 'bubble ' + type;

    var dataField = type + year;

    svg.append('g')
        .attr('class', bubbleClass)
        .selectAll('circle')
        .data(topojson.feature(euJson, euJson.objects.countries).features
            .sort(function (a, b) {
                return b.properties[dataField] - a.properties[dataField];
            }))
        .enter().append('circle')
        .attr('transform', function (d) {
            return 'translate(' + path.centroid(d) + ')';
        })
        .attr('r', function (d) {
            return radius(d.properties[dataField]);
        })
        .append('title')
        .text(function (d) {
            return d.properties.name
                + '\n' + type + ' in ' + year + ':  ' + formatNumber(d.properties[dataField]);
        }).attr('class', 'bubbletext');


    var legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', 'translate(' + (width - 50) + ',' + (height - 20) + ')')
        .selectAll('g')
        .data([zoomRange[1] / 10, zoomRange[1] / 2, zoomRange[1]])
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

}