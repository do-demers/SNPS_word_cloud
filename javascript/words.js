function init() {

    d3.csv("data/words.csv", function (data) {
        launch(data);
    });
}

function launch(data) {
    drawWordCloud(data);

    d3.select("#changeCount").on("click", function () {
        drawWordCloud(data);
    });
}

function drawWordCloud(data) {
    d3.select("svg").remove();

    var nWords = d3.select("#nCount").property("value");

    if (nWords >400){
        nWords = 400;
    }

    var list = [];

    for (var i = 0; i < nWords; i++) {
        list[i] = data[i];
    }
    var svg_location = "#cloud";
    var width = 1024;
    var height = 768;

    var fill = d3.scale.category20();

    var max = d3.max(list, function (d) {
        return +d.count;
    });
    var min = d3.min(list, function (d) {
        return +d.count;
    });

    var colScale = d3.scale.quantile()
        .domain([min, max])
        .range([
            '#3288bd',
            '#66c2a5',
            '#67ae47',
            '#ffd76e',
            '#f46d43',
            '#d53e4f',
            '#ae0149'
        ]);

    var xScale = d3.scale.linear()
        .domain([min, max])
        .range([10, 75]);

    d3.layout.cloud().size([width, height])
        .timeInterval(20)
        .words(list)
        .fontSize(function (d) {
            return xScale(+d.count);
        })
        .text(function (d) {
            return d.word;
        })
        .rotate(function () {
            return ~~(Math.floor(Math.random() * 150) - 75);
        })
        .font("Impact")
        .on("end", draw)
        .start();

    function draw(words) {
        d3.select(svg_location).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + [width >> 1, height >> 1] + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function (d) {
                return xScale(+d.count) + "px";
            })
            .style("font-family", "Impact")
            .style("fill", function (d) {
                return colScale(+d.count);
            })
            .attr("text-anchor", "middle")
            .attr("transform", function (d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function (d) {
                return d.word;
            });
    }

    d3.layout.cloud().stop();
}