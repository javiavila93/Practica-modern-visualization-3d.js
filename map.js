//codigo js para mapa

d3.json('practica_airbnb.json') //Carga de datos
    .then((featureCollection) => {
        drawMap(featureCollection);
    });

//Función constructora del mapa
function drawMap(featureCollection) {
    //variables tamañano para svg
    var width = 800;
    var height = 800;

    var svg = d3.select('#map')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g');

    var center = d3.geoCentroid(featureCollection); //Encontrar la coordenada central del mapa (de la featureCollection)

    //var center_area = d3.geoCentroid(featureCollection.features[0]); //Encontrar la coordenada central de un area. (de un feature)

    var projection = d3.geoMercator()
        .fitSize([width, height], featureCollection)
        .center(center)
        .translate([width / 2, height / 2])


    //Para crear paths a partir de una proyección
    var pathProjection = d3.geoPath().projection(projection);
    var features = featureCollection.features;

    // Se añade el indice, color y avg_price con los datos de cada figura
    features.forEach((d, i) => {
        d.idx = i;
        d.avgprice = d.properties.avgprice
        //d.avgbedrooms = d.properties.avgbedrooms;
        });

//dominio para la escala de color
    var domainColor = d3.extent(features, function (d) {
        return d.avgprice;
    });
    var domainColorLegend = d3.extent(features, function (d) {
        return d.idx;
    });
//Se crea la escala de color
    var scaleColor = d3.scaleSequential()
    .domain(domainColor)
    .range([0,1]);

    var scaleColorLegend = d3.scaleSequential()
    .domain(domainColorLegend)
    .range([0,1]);

    features.forEach((d, i) => {
        d.color = d3.interpolateOrRd(scaleColor(d.avgprice));
        d.colorlegend = d3.interpolateOrRd(scaleColorLegend(d.idx));
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
        d.opacity = 1;
        return d.opacity})
    .attr("fill", d => d.color)
    .attr("stroke-width", 1)
    .attr("stroke", "black")
    .attr("stroke-dasharray", "1")
    


var rectWidth = 5;

  var legend =
    d3.select("#map")
    .append("div")
    .append("svg")
    .attr("width", width)
    .attr("height", 100)
    .append("g")
    //.attr("transform", "translate(50, 50)")
    .selectAll("rect")
    .data(features)
    .enter()
    .append("rect")
    .attr("x", function(d) {
        return width/16 + d.idx*rectWidth - 10
    })
    .attr("y", 10)
    .attr("width", rectWidth)
    .attr("height", 25)
    .attr("fill", function(d) {
        return d.colorlegend;
    })
    .attr("stroke", function(d) {
        return d.colorlegend;
    })
    .attr("stroke-width", 1)
    .on("mouseover", mouseOverLegend)
    .on("click", showMap);



    createdPath
    .on("mouseover", mouseOverMap)
    .on("click", clickColor)
    /*.on("click", drawChart);*/
    //.on("click", onlyZone); Zoom y centrar zona al hacer clic si da tiempo
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

function mouseOverLegend (event, d) {
    d3.select(this)
    .transition()
    .duration(1000);

    tooltip
    .transition()
    .duration(200)
    .style("visibility", "visible")
    .style("left", event.pageX + 20 + "px")
    .style("top", event.pageY - 30 + "px")
    .text("Precio Medio -> Min: " + domainColor[0] + " Max: " + domainColor[1]); //Intentar poner multilínea
};

function clickColor (event, d) {
    d3.selectAll("path")
    .transition("hiddenMap")
    .duration(500)
    .attr("opacity", 0);
    d3.select(this)
    .transition("showZone")
    .delay(100)
    .duration(500)
    .attr("opacity", 0.95);
    }

function showMap (event, d) {
    d3.selectAll("path").attr("opacity", 1);
}

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