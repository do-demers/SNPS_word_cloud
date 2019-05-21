function init() {

    d3.csv("data/words.csv", function (data) {
        launch(data);
    });
}

function launch(data) {

    console.log(data);
    drawWordCloud(data);

    d3.select("#changeCount").on("click", function () {
        drawWordCloud(data);
    });
}

function drawWordCloud(data) {
    d3.select("svg").remove();

    var nWords = d3.select("#nCount").property("value");

    if (nWords >100){
        nWords = 100;
    }

    var list = [];

    for (var i = 0; i < nWords; i++) {
        list[i] = data[i];
    }
    var svg_location = "#cloud";
    var width = 1000;
    var height = 667;

    var max = d3.max(list, function (d) {
        return +d.count;
    });
    var min = d3.min(list, function (d) {
        return +d.count;
    });

   /* var colScale = d3.scale.quantile()
        .domain([min, max])
        .range([
            '#393b79',
            '#5254a3',
            '#6b6ecf',
            '#9c9ede',
            '#637939',
            '#8ca252',
            '#b5cf6b',
            '#cedb9c',
            '#8c6d31',
            '#bd9e39',
            '#e7ba52',
            '#e7cb94',
            '#843c39',
            '#ad494a',
            '#d6616b',
            '#e7969c',
            '#7b4173',
            '#a55194',
            '#ce6dbd',
            '#de9ed6'
        ]);*/

   var colScale = d3.scale.ordinal()
       .range([
           '#393b79',
           '#5254a3',
           '#6b6ecf',
           '#9c9ede',
           '#637939',
           '#8ca252',
           '#b5cf6b',
           '#cedb9c',
           '#8c6d31',
           '#bd9e39',
           '#e7ba52',
           '#e7cb94',
           '#843c39',
           '#ad494a',
           '#d6616b',
           '#e7969c',
           '#7b4173',
           '#a55194',
           '#ce6dbd',
           '#de9ed6'
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
        .font("Helvetica")
        .fontWeight("700")
        .text(function (d) {
            var txt = d.word;
            return txt.toUpperCase();
        })
        .rotate(0)
        /*.rotate(function () {
            return ~~(Math.floor(Math.random() * 150)-75);
        })*/
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
            .style("font-family", "Helvetica")
            .style("font-weight", "700")
            .style("fill", function (d,i) {
                //return colScale(+d.count);
                return colScale(i);
            })
            .attr("text-anchor", "middle")
            .attr("transform", function (d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function (d) {
                var txt = d.word;
                return txt.toUpperCase();
            });
    }

    d3.layout.cloud().stop();
}