function init() {

   /* d3.csv("data/words_105.csv", function (data1_105) {
        d3.csv("data/words_2_105.csv", function (data2_105) {
            d3.csv("data/words_3_105.csv", function (data3_105) {
                launch(data1_105, data2_105, data3_105);
            });
        });
    });*/


     d3.queue()
     .defer(d3.csv, "data/words_105.csv")
     .defer(d3.csv, "data/words_2_105.csv")
     .defer(d3.csv, "data/words_3_105.csv")
     .defer(d3.csv, "data/words_110.csv")
     .defer(d3.csv, "data/words_2_110.csv")
     .defer(d3.csv, "data/words_3_110.csv")
     .await(launch); //only function name is needed

}

function launch(error, data1_105, data2_105, data3_105, data1_110, data2_110, data3_110) {

    if (error) throw error;

    var gram1BTN = document.getElementById('grams1');
    var gram2BTN = document.getElementById('grams2');
    var q105BTN = document.getElementById('q105');
    var q110bBTN = document.getElementById('q110b');

    //Start with default checked options
    drawWordCloud(data1_105);

    d3.select("#changeCount").on("click", function () {

        if(q105BTN.checked) {
            if (gram1BTN.checked) {
                drawWordCloud(data1_105);
            }
            else if (gram2BTN.checked) {
                drawWordCloud(data2_105);
            }
            else //For 3 gram choice
                drawWordCloud(data3_105);
        }
        else{//For q110
            if (gram1BTN.checked) {
                drawWordCloud(data1_110);
            }
            else if (gram2BTN.checked) {
                drawWordCloud(data2_110);
            }
            else //For 3 gram choice
                drawWordCloud(data3_110);
        }

    });
}

function drawWordCloud(data) {
    d3.select("svg").remove();

    var nWords = d3.select("#nCount").property("value");

    if (nWords > 99) {
        nWords = 99;
    }

    var list = [];

    for (var i = 0; i < nWords; i++) {
        list[i] = data[i];
    }
    var svg_location = "#cloud";
    var width = 900;
    var height = 900;

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

    var colScale = d3.scaleOrdinal()
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

    var xScale = d3.scaleLinear()
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
            .style("fill", function (d, i) {
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