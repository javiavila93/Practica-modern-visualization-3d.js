
//Código js parala creación de las gráficas d3

//Carga de datos e inicialización de función principal
d3.json('practica_airbnb.json') 
    .then((featureCollection) => {
        drawMap(featureCollection);
    });

//Función constructora del mapa y la gráfica
function drawMap(featureCollection) {
    //variables tamañano para svg
    var width = 800;
    var height = 800;

    //Se crea svg y se inserta en el espacio div graphs
    var svg = d3.select('#graphs')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g');

    // Se define el centro del mapa con geoCentroid
    var center = d3.geoCentroid(featureCollection);

    // se define projection y se ajusta al espacio definido
    var projection = d3.geoMercator()
        .fitSize([width, height], featureCollection)
        .center(center)
        .translate([width / 2, height / 2])

    //se define la función generadora de path con geoPath
    var pathProjection = d3.geoPath().projection(projection);
    var features = featureCollection.features;
    var barrio_madrid = featureCollection.features[0];

    //Se extraen los datos necesarios para las escalas en caso de no tener dato se pone por defecto 0
    features.forEach((d, i) => {
        d.idx = i;
        d.avgprice = d.properties.avgprice || 0;
        d.rooms = d.properties.avgbedrooms || 0;
        });

    // Se definen la variables de dominio del color del mapa y la leyenda con extent
    var domainColor = d3.extent(features, function (d) {
        return d.avgprice;
    });
    var domainColorLegend = d3.extent(features, function (d) {
        return d.idx;
    });

    // Se definen las escalas con el dominio anterior
    var scaleColor = d3.scaleSequential()
    .domain(domainColor)
    .range([0,1]);

    var scaleColorLegend = d3.scaleSequential()
    .domain(domainColorLegend)
    .range([0,1]);

    // Se interpola los valores de los colores según los valores de avgprice para el mapa y idx para la leyenda
    features.forEach((d, i) => {
        d.color = d3.interpolateOrRd(scaleColor(d.avgprice));
        d.colorlegend = d3.interpolateOrRd(scaleColorLegend(d.idx));
        });

    //Se define el tooltip informativo a utilizar utilizando los estilos del css
    var tooltip = d3
    .select("#graphs")
    .append("div")
    .attr("class","tooltip")
    .style("padding", 5);

    //Inicializamos la creación del mapa
    var createdPath = svg.selectAll('path')
    .data(features)
    .enter()
    .append('path')
    .attr("id", (d) => d.idx)
    .attr('d', (d) => pathProjection(d));

// Se difine un valor por defecto para crear la leyenda
var rectWidth = 5;

// Se crea una leyenda y se definen sus paramétros
var legend =
    d3.select("#graphs")
    .append("div")
    .append("svg")
    .attr("id", "legend")
    .attr("width", width)
    .attr("height", 100)
    .append("g")
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
    .on("mouseover", mouseOverLegend) //Función para tooltip en la leyenda
    .on("mouseout", mouseOut); //Función para quitar el tooltip en la leyenda

    //  Transición de entrada del mapa al iniciarla la página
    createdPath
    .transition("EnterMap")
    .delay((d) => 100+100*d.idx)
    .duration(500)
    .attr("opacity", function(d, i) {
        d.opacity = 1;
        return d.opacity})
    .attr("fill", d => d.color)
    .attr("stroke-width", 1)
    .attr("stroke", "black")
    .attr("stroke-dasharray", "1");

    createdPath.on("mouseover", mouseOverMap); //Función Tooltip para el mapa

    createdPath.on("mouseout", mouseOut);//Ocultar el tooltip

//Función Ocultar Tooltip
function mouseOut (event, d) {
    tooltip
    .transition()
    .duration(200)
    .style("visibility", "hidden")
};

// Función Mostrar Tooltip Mapa
function mouseOverMap (event, d) {
    d3.select(this)
    .transition("tooltip")
    .duration(1000);

    tooltip
    .transition()
    .duration(200)
    .style("visibility", "visible")
    .style("left", event.pageX + 20 + "px")
    .style("top", event.pageY - 30 + "px")
    .text(`Barrio: ${d.properties.name} Precio Medio: ${d.avgprice}`); //Intentar poner multilínea
};

// Función Mostrar Tooltip Leyenda
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

//Creación del svg para la gráfica de barras, se añade en el mismo Div, se crea un svg y se translada
var svg_barchat = d3.select('#graphs')
    .append('svg')
    .attr('width', width)
    .attr('height', height + 70)
    .attr('transform','translate(' + width + ',' + -height + ')')
    .append("g");

//Inicializamos la gráfica
drawBarchart(barrio_madrid.properties.avgbedrooms);

//Función constructora de la gráfica
function drawBarchart(avgbedrooms) {
    var marginLeft = 50;
    var marginTop = 70;
    var width = 800/2
    var height = 800 - marginTop;

//Definimos las escalas
var scaleX = d3.scaleBand().range([marginLeft, width]).padding(0.1);
var scaleY = d3.scaleLinear().range([height, marginTop]);

//Definimos el color de la escala
var scaleColorBar = d3.scaleOrdinal(d3.schemePaired);

//Definimos los Ejes
var xAxis = d3.axisBottom(scaleX).tickSizeOuter(0);
var yAxis = d3.axisLeft(scaleY);

//Disporador para el cambio de gráfica según se clique en el mapa
createdPath.on("click", redrawtransition)

redraw(avgbedrooms);

//Construimos previamente los ejes y los títulos
svg_barchat
    .append("g")
    .attr("class", "axisY")
    .attr("transform", `translate(${marginLeft})`)
    .call(yAxis);

svg_barchat
    .append("g")
    .attr("class", "axisX")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

svg_barchat
    .append("text")
    .attr("transform", "translate(" + width/2 + "," + (height + 40) + ")")
    .style("text-anchor", "middle")
    .text("Nº de habitaciones");

svg_barchat
    .append("text")
    .attr("y", 20)
    .attr("x", marginLeft - 25)
    .attr("dx", "1em")
    .text("Nº de propiedades");

//Función que recoge el dato idx para pintar la gráfica y llama a la función contructora
function redrawtransition (event, d) {
    redraw(d.properties.avgbedrooms);
};

//Función para la interactividad de la gráfica de barras
function redraw(avgbedrooms) {
var speed = 1000;

//Definimos los dominos del mapa
scaleX.domain(avgbedrooms.map((d) => d.bedrooms));
scaleY.domain([0, d3.max(avgbedrooms, (d) => d.total)]);

//Borramos los rectangulos previos
svg_barchat.selectAll("rect").remove();
svg_barchat.selectAll(".recttext").remove();

//Llamamos de nuevo a los ejes para que se adapten a la nueva gráfica
svg_barchat.selectAll(".axisX").transition().duration(speed).call(xAxis);
svg_barchat.selectAll(".axisY").transition().duration(speed).call(yAxis);

//Introduccimos de nuevo las barras en la gráfica
var rect = svg_barchat
    .append("g")
    .selectAll("rect")
    .data(avgbedrooms)
    .enter()
    .append("rect")
    .attr("x", (d) => scaleX(d.bedrooms))
    .attr("y", height)
    .attr("width", scaleX.bandwidth())
    .attr("fill", (d) => scaleColorBar(d.bedrooms))
    .attr("stroke", "black")
    .attr("stroke-width", "1px");

//Insertamos una transicción de abajo a arriba
rect
    .transition()
    .duration(speed)
    .ease(d3.easeLinear)
    .attr("y", (d) => scaleY(d.total))
    .attr("height", (d) => scaleY(0) - scaleY(d.total));

//Imcluimos los textos de los cuadros
var text = svg_barchat
    .append("g")
    .selectAll("text")
    .data(avgbedrooms)
    .enter()
    .append("text")
    .attr("class", "recttext")
    .text((d) => d.total)
    .attr("x", function (d) {
        var textLength = this.getComputedTextLength();
        return scaleX(d.bedrooms) + scaleX.bandwidth() / 2 - textLength / 2;
    })
    .attr("y", height)
    .attr("fill", "black");

//Colocamos por encima de la rectangulos sus correspondientes textos para
text
    .transition()
    .duration(speed)
    .ease(d3.easeLinear)
    .attr("y", (d) => {
        var borderTop = 15;
        var y = scaleY(d.total) - borderTop;
        return y > height ? height : y;
    });
    }

};
};