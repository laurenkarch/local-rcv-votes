(function () {
  'use strict';

  adjustHeight();
  window.addEventListener("resize", () => {
    // remove existing SVG
    d3.selectAll("svg").remove();

    // use promise to call all data files, then send data to callback
    Promise.all([stateGeoJson])
      .then(drawMap)
      .catch((error) => {
        console.log(error);
      });

    adjustHeight();
  });

  // request the JSON text file, then call drawMap function
  // request our data files and reference with variables
  const stateGeoJson = d3.json('data/states.geojson')


  // wait until data is loaded then send to draw map function
  Promise.all([stateGeoJson]).then(drawMap);

  function drawMap(data) {

    // select the HTML element that will hold our map
  const mapContainer = d3.select('#map')

  // determine width and height of map from container
  const width = mapContainer.node().offsetWidth - 60; 
  const height = mapContainer.node().offsetHeight - 60;

  // create and append a new SVG element to the map div
  const svg = mapContainer
    .append('svg')
    .attr('width', width) // provide width and height attributes
    .attr('height', height)

    // refer to different datasets
    const stateData = data[0];

    // declare a geographic path generator
    // fit the extent to the width and height using the geojson
    // fit the extent to the width and height using the geojson
    const projection = d3.geoAlbersUsa()
      .fitSize([width, height], stateData); // update here

    // declare a path generator using the projection
    const path = d3.geoPath()
      .projection(projection);

    
  

      // append states
    svg.append('g')
    .selectAll('path')
    .data(stateData.features) // update here
    .join('path')
    .attr('d', path)
    .attr('class', 'state')
    .classed('state', true) // give each path element a class name of state

    makeZoom(svg)
  } // end of drawMap function
  // Set heights for page sections
  // adjustHeight();

  // D3 time



  // Utility functions
  // window.addEventListener('resize', adjustHeight)

  function adjustHeight() {
    const mapSize = document.querySelector("#map"),
      contentSize = document.querySelector("#content"),
      removeFooter = document.querySelector('#footer').offsetHeight,
      removeHeader = document.querySelector('#header').offsetHeight
    const resize = window.innerHeight - removeFooter - removeHeader;
    if (window.innerWidth >= 768) {
      contentSize.style.height = `${resize}px`
      mapSize.style.height = `${resize}px`
    } else {
      contentSize.style.height = `${resize * 0.25}px`
      mapSize.style.height = `${resize * 0.75}px`
    }
  }
  function makeZoom(svg) {
    const zoom = d3
      .zoom()
      // on zoom (many events fire this event like mousemove, wheel, dblclick, etc.)...
      .on("zoom", (event) => {
        svg
          // select all paths in svg
          .selectAll("path")
          // transform path based on event
          .attr("transform", event.transform)
          // change stroke width on zoom
          .attr("stroke-width", 1 / event.transform.k);
      });

    // Attach function to svg
    svg.call(zoom);
  }
})();