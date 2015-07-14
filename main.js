function drawMap(year) {
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

    radius = d3.scale.sqrt()
        .domain([0, 300000000])
        .range([0, 30]);

    formatNumber = d3.format('>-,');
    d3.json('build/eu_pax.json', function (error, eu) {
        if (error) return console.error(error);
        console.log('hier');
        console.log(eu);
        euJson = eu;


        svg.append('path')
            .datum(topojson.feature(eu, eu.objects.countries))
            .attr('d', path);

        //add classes
        svg.selectAll('.subunit')
            .data(topojson.feature(eu, eu.objects.countries).features)
            .enter().append('path')
            .attr('class', function (d) {
                if (d.id !=-99){
                return 'subunit ' + d.id;}
                return 'subunit NO';
            })
            .attr('d', path);

        // Add Label
        svg.selectAll('.subunit-label')
            .data(topojson.feature(eu, eu.objects.countries).features)
            .enter().append('text')
            .attr('class', function (d) {
                if (d.id !=-99){
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

        drawBubbles(year);
    });


}

function drawBubbles(year) {
    $('.bubble').empty();
    var paxYear = 'pax' + year;

    svg.append('g')
        .attr('class', 'bubble')
        .selectAll('circle')
        .data(topojson.feature(euJson, euJson.objects.countries).features
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

}


function setYear(sel) {
    drawBubbles(sel.value);
}