// codigo js para la gráfica de barra

d3.json('practica_airbnb.json') //Carga de datos
    .then((featureCollection) => {
        drawBarchart(featureCollection);
    });

    function drawBarchart(featureCollection) {
    var width = 250;
    var height = 500;
    var features = featureCollection.features;

    var svg = d3.select('#barchart')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr(transform('transform','translate(600,0)'))
    .append("circle")
    .attr("fill", "green")
    .attr("cx", 700)
    .atrr("cy", 50)
    .attr("r", 50);




}