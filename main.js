/**
 * Global Variables
 */
//Text that explains the selected data
var explanation = [];
explanation.goods = "<p> The indicator shows the volume of goods transported in Europe (in tonnes), broken down by country and by year.</p>" +
    "<p>The data covers the total volume of freight and mail loaded/unloaded.";
explanation.pax = "<p>All passengers on a particular flight (with one flight number) counted once only and not repeatedly on each individual stage of that flight.</p>" +
    "<p>They are all revenue and non-revenue passengers whose journey begins or terminates at the reporting airport " +
    "and transfer passengers joining or leaving the flight at the reporting airport.</p>" +
    "<p>Direct transit passengers are excluded.</p>";

//Map size
var mapWidth = 650,
    mapHeight = 600;

//Projection config of the map
var projection = d3.geo.mercator()
    .center([9, 55])
    .scale(460)
    .translate([mapWidth / 2, mapHeight / 2]);

//D3 Number format
var formatNumber = d3.format('>-,');

//D3 SVG path
var path = d3.geo.path()
    .projection(projection)
    .pointRadius(2);

// json object with map and statistical data
var dataJson = {};

function drawMap() {
    $('.map').empty();

    svg = d3.select('.map').append('svg')
        .attr('width', mapWidth)
        .attr('height', mapHeight);


    d3.json('build/eu_data.json', function (error, eu) {
        if (error) return console.error(error);
        dataJson = eu;

        svg.append('path')
            .datum(topojson.feature(eu, dataJson.objects.countries))
            .attr('d', path);

        //add classes
        svg.selectAll('.subunit')
            .data(topojson.feature(eu, dataJson.objects.countries).features)
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
            .data(topojson.feature(eu, dataJson.objects.countries).features)
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
        type = $("input.typeRadio:checked").val();
    var zoomRange = [0, 300000000];

    if (type === 'goods') {
        zoomRange = [0, 4300000];
    }

    var radius = d3.scale.sqrt()
        .domain(zoomRange)
        .range([0, 30]);

    $('.bubble').empty();
    $('.legend').empty();
    $('#explanation').html(explanation[type])
    var bubbleClass = 'bubble ' + type;

    var dataField = type + year;

    svg.append('g')
        .attr('class', bubbleClass)
        .selectAll('circle')
        .data(topojson.feature(dataJson, dataJson.objects.countries).features
            .sort(function (a, b) {
                return b.properties[dataField] - a.properties[dataField];
            }))
        .enter().append('circle')
        .attr('transform', function (d) {
            return 'translate(' + path.centroid(d) + ')';
        })
        .attr('r', function (d) {
            if (isNaN(d.properties[dataField])){
                return 0;
            }
            return radius(d.properties[dataField]);
        })
        .append('title')
        .text(function (d) {
            return d.properties.name
                + '\n' + type + ' in ' + year + ':  ' + formatNumber(d.properties[dataField]);
        }).attr('class', 'bubbletext');


    var legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', 'translate(' + (mapWidth - 50) + ',' + (mapHeight - 20) + ')')
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