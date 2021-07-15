//codigo js para mapa

d3.json('practica_airbnb.json') //Carga de datos
    .then((featureCollection) => {
        drawMap(featureCollection);
    });


function drawMap(featureCollection) {
    var width = 800;
    var height = 800;

    var svg = d3.select('#map')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g');

    var center = d3.geoCentroid(featureCollection); //Encontrar la coordenada central del mapa (de la featureCollection)

    var center_area = d3.geoCentroid(featureCollection.features[0]); //Encontrar la coordenada central de un area. (de un feature)

    var projection = d3.geoMercator()
        .fitSize([width, height], featureCollection)
        .center(center)
        .translate([width / 2, height / 2])


    //Para crear paths a partir de una proyección
    var pathProjection = d3.geoPath().projection(projection);
    var features = featureCollection.features;


//dominio para la escala de color
    var domainColor = d3.extent(features, function (d) {
        return d.properties.avgprice;
    });
//Se crea la escala de color
    var scaleColor = d3.scaleSequential()
    .domain(domainColor)
    .range([0,1]);

// Se añade el indice, color y avg_price con los datos de cada figura
    features.forEach((d, i) => {
    d.idx = i;
    d.color = d3.interpolateRdGy(scaleColor(d.properties.avgprice));
    d.avgprice = d.properties.avgprice;
    //d.avgbedrooms = d.properties.avgbedrooms;
    });

    var tooltip = d3
    .select("#map")
    .append("div")
    .attr("class","tooltip")
    .style("padding", 5);


    var createdPath = svg.selectAll('path')
    .data(features)
    .enter()
    .append('path')
    .attr("id", (d) => d.idx)
    .attr('d', (d) => pathProjection(d))
    .attr("opacity", function(d, i) {
        d.opacity = 1
        return d.opacity})
    .attr("fill", d => d.color)
    .on("mouseover", mouseOverMap)
    .on("click", function (event, d) {
        if (d.opacity == 1){
            d3.selectAll("path").attr("opacity", 0);
            d3.select(this).attr("opacity", 1);
        } else if (d.opacity == 0) {
            d3.selectAll("path").attr("opacity", 1);
        }}
    );
    //.on("click", onlyZone); Zoom y centrar zona al hacer clic

/*createdPath.append("g")
    .append("rect")
    .attr("x", width/2 + idx*1)
    .attr("y", height/2 + 25)
    .attr("width", 50)
    .attr("height", 50)
    .attr("fill", "green");*/

function mouseOverMap (event, d) {
    d3.select(this)
    .transition()
    .duration(1000);

    tooltip
    .transition()
    .duration(200)
    .style("visibility", "visible")
    .style("left", event.pageX + 20 + "px")
    .style("top", event.pageY - 30 + "px")
    .text(`Barrio: ${d.properties.name} Precio Medio: ${d.avgprice}`); //Intentar poner multilínea


};





/*function onlyZone(event, d) {
    d3.selectAll(this)
    .transition("showzoom")
    .duration(0)
    .delay(0)
    .attr("opacity", function (d));

    d3.selectAll("path")
    .transition("hidden")
    .duration(200)
    .delay(200)
    .attr("opacity", 0);
};*/



}

/*     createdPath.on('click', function(event, d) {
        d.opacity = d.opacity ? 0 : 1;
        d3.select(this).attr('opacity', d.opacity););
    })*/

    //var scaleColor = d3.scaleLinear().range(["white", "red"]);
   //createdPath.attr('fill', (d) => scaleColor(d.value));



    //Creacion de una leyenda
    /* var nblegend = 10;
    var widthRect = (width / nblegend) - 2;
    var heightRect = 10;

    var scaleLegend = d3.scaleLinear()
        .domain([d3.min(featureCollection, function (d) {return d.avgprice}), d3.max(featureCollection, function (d) {return d.avgprice})]);


    var text_legend = svg.append("g")
        .selectAll("text")
        .data(d3.schemeTableau10)
        .enter()
        .append("text")
        .attr("x", (d, i) => scaleLegend(i)) // o (i * (widthRect + 2))
        .attr("y", heightRect * 2.5)
        .text((d) => d)
        .attr("font-size", 12)
}

Si quisiesemos unir  dos archivos Geojson
npm install -g topojson (Primero instalar node.js) => solo para uniones
topojson spain.json canarias.json -o full_spain.json*/