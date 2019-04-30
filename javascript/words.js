function init(){

    d3.csv("data/words.csv",function(data){
        drawWordCloud(data);
    });

    function drawWordCloud(data){

        var svg_location = "#cloud";
        var width = 800;
        var height = 600;

        /*var fill = [
            '#a6cee3',
            '#1f78b4',
            '#b2df8a',
            '#33a02c',
            '#e31a1c',
            '#fdbf6f',
            '#ff7f00',
            '#c654ff'
        ];*/
        var fill = d3.scale.category20();

        var word_entries = data;

        var max =  d3.max(word_entries, function(d) { return +d.count;});
        var min=  d3.min(word_entries, function(d) { return +d.count;});

        /* var colScale = d3.scale.quantize()
            .domain([min,max/10])
            .range([0,7]);*/

        var xScale = d3.scale.linear()
            .domain([min,max])
            .range([10,100]);

        d3.layout.cloud().size([width, height])
            .timeInterval(20)
            .words(word_entries)
            .fontSize(function(d) { return xScale(+d.count); })
            .text(function(d) { return d.word; })
            .rotate(function() { return ~~(Math.random() * 2) * 90; })
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
                .style("font-size", function(d) {
                    return xScale(+d.count) + "px";
                })
                .style("font-family", "Impact")
                .style("fill", function(d,i) {
                    return fill(i);
                })
                .attr("text-anchor", "middle")
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function(d) { return d.word; });
        }

        d3.layout.cloud().stop();
    }
}