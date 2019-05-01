function init(){

    d3.csv("data/words.csv",function(data){
        drawWordCloud(data);
    });

    function drawWordCloud(data){

        var svg_location = "#cloud";
        var width = 800;
        var height = 600;

        var fill = d3.scale.category20();

        var word_entries = data;

        var max =  d3.max(word_entries, function(d) { return +d.count;});
        var min =  d3.min(word_entries, function(d) { return +d.count;});

        var colScale = d3.scale.quantile()
            .domain([min,max])
            .range([
                '#3288bd',
                '#66c2a5',
                '#67ae47',
                '#ffd76e',
                '#f46d43',
                '#d53e4f',
                '#ae0149'

                /*'#aab4bd',
                '#4292c6',
                '#85d15b',
                '#fe9929',
                '#d53e4f'*/
            ]);

        var xScale = d3.scale.linear()
            .domain([min,max])
            .range([10,100]);

        d3.layout.cloud().size([width, height])
            .timeInterval(20)
            .words(word_entries)
            .fontSize(function(d) { return xScale(+d.count); })
            .text(function(d) { return d.word; })
            .rotate(function() { return ~~(Math.floor(Math.random() * 180) - 90); })
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
                    return colScale(+d.count);
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