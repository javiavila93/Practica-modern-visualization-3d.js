// codigo js para la gráfica de barra

/**d3.json('practica_airbnb.json') //Carga de datos
    .then((featureCollection) => {
        drawBarchart(featureCollection);
    });

    function drawBarchart(featureCollection) {
    var moveX = width + 50;

        var svg_barchat = d3.select('#map')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('transform','translate(' + moveX + ',' + -height + ')')
        .append("g")

    function drawChart(event, d) {
        d3.select(svg_barchat)
        .select("rect")
        .append("rect")
        .attr("class", "barcharts_bedrooms")
        .attr("height", 400);




}*/