(function () {

    'use strict';
    adjustHeight();

    function adjustHeight() {
        const mapSize = document.querySelector("#map"),
            contentSize = document.querySelector("#content"),
            removeHeight = document.querySelector("#footer").offsetHeight,
            resize = window.innerHeight - removeHeight;

        mapSize.style.height = `${resize}px`;
        console.log(resize);
        if (window.innerWidth >= 768) {
            contentSize.style.height = `${resize}px`;
            mapSize.style.height = `${resize}px`;
        } else {
            contentSize.style.height = `${resize * 0.25}px`;
            mapSize.style.height = `${resize * 0.75}px`;
        }
        window.addEventListener("resize", adjustHeight);
    }
    const button = document.querySelector("#legend button")
    button.addEventListener('click', function () {
        const legend = document.querySelector(".leaflet-legend")
        legend.classList.toggle('show-legend')
    })

    var map = L.map("map", {
        zoomSnap: 0.1,
        center: [37.8, -96],
        zoom: 4,
        zoomControl: false,
        minZoom: 1,
        maxZoom: 9,
    });
    var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);


    omnivore
        .csv("data/RCV_Data.csv")
        .on("ready", function (e) {
            drawMap(e.target.toGeoJSON());
            drawLegend(e.target.toGeoJSON());
        })
        .on("error", function (e) {
            console.log(e.error[0].message);

        });

    function drawMap(data) {
        const options = {
            pointToLayer: function (feature, ll) {
                return L.circleMarker(ll, {
                    opacity: 1,
                    weight: 2,
                    fillOpacity: 0,

                });
            },

        };
        // create 2 separate layers from GeoJSON data
        const proLayer = L.geoJson(data, options).addTo(map),
            antiLayer = L.geoJson(data, options).addTo(map);

        // fit the bounds of the map to one of the layers
        map.fitBounds(proLayer.getBounds(), {
            padding: [50, 50],
        });
        // color the layers different colors
        proLayer.setStyle({
            color: getColor("pro"),
        });
        antiLayer.setStyle({
            color: getColor("anti"),
        });
        resizeCircles(proLayer, antiLayer);

    } // end drawMap()

    //getcolor function
    function getColor(x) {
        // Access the fourth stylesheet referenced in the HTML head element
        const stylesheet = document.styleSheets[3];
        const colors = [];

        // Check out the rules in the stylesheet
        console.log(stylesheet.cssRules);

        // Loop through the rules in the stylesheet
        for (let i of stylesheet.cssRules) {
            // When we find girls, add it's color to an array
            if (i.selectorText === ".pro") {
                colors[0] = i.style.backgroundColor;
            }
            if (i.selectorText === ".anti") {
                colors[1] = i.style.backgroundColor;
            }
        }

        // If function was given 'girls' return that color
        if (x == "pro") {
            return colors[0];
        } else {
            return colors[1];
        }
    }
    //end of getcolor

    function resizeCircles(proLayer, antiLayer) {
        proLayer.eachLayer(function (layer) {
            const radius = calcRadius(
                Number(layer.feature.properties["Pro"])
            );
            layer.setRadius(radius);
        });
        antiLayer.eachLayer(function (layer) {
            const radius = calcRadius(
                Number(layer.feature.properties["Anti"])
            );
            layer.setRadius(radius);
        });
        // update the hover window with current grade's
        retrieveInfo(antiLayer);
    }


    //calcradius function
    function calcRadius(val) {
        const radius = Math.sqrt(val / Math.PI);
        return radius * 0.075; // adjust .5 as a scale factor
    }
    //end of calcradius 


    function drawLegend(data) {
        const legendControl = L.control({
            position: 'bottomright'
        });
        legendControl.onAdd = function () {
            const legend = L.DomUtil.get("legend");
            L.DomEvent.disableScrollPropagation(legend);
            L.DomEvent.disableClickPropagation(legend);
            return legend;
        }
        // empty array to hold values
        const dataValues = [];

        // loop through all features
        data.features.forEach(function (locality) {
            // for each grade in a school
            for (let vote in locality.properties) {
                // shorthand to each value
                const value = locality.properties[vote];
                // if the value can be converted to a number
                // the + operator in front of a number returns a number
                if (+value) {
                    //return the value to the array
                    dataValues.push(+value);
                }
            }
        });
        // verify your results!
        console.log(dataValues);
        // sort our array
        const sortedValues = dataValues.sort(function (a, b) {
            return b - a;
        });

        // round the highest number and use as our large circle diameter
        const maxValue = Math.round(sortedValues[0] / 1000) * 1000;
        // calc the diameters
        const largeDiameter = calcRadius(maxValue) * 2,
            smallDiameter = largeDiameter / 2;

        // create a function with a short name to select elements
        const $ = function (x) {
            return document.querySelector(x);
        };

        // select our circles container and set the height
        $(".legend-circles").style.height = `${largeDiameter.toFixed()}px`;

        // set width and height for large circle
        $(".legend-large").style.width = `${largeDiameter.toFixed()}px`;
        $(".legend-large").style.height = `${largeDiameter.toFixed()}px`;

        // set width and height for small circle and position
        $(".legend-small").style.width = `${smallDiameter.toFixed()}px`;
        $(".legend-small").style.height = `${smallDiameter.toFixed()}px`;
        $(".legend-small").style.top = `${largeDiameter - smallDiameter - 2}px`;
        $(".legend-small").style.left = `${smallDiameter / 2}px`;

        // label the max and half values
        $(".legend-large-label").innerHTML = `${maxValue.toLocaleString()}`;
        $(".legend-small-label").innerHTML = (maxValue / 2).toLocaleString();

        // adjust the position of the large based on size of circle
        $(".legend-large-label").style.top = `${-11}px`;
        $(".legend-large-label").style.left = `${largeDiameter + 30}px`;

        // adjust the position of the large based on size of circle
        $(".legend-small-label").style.top = `${smallDiameter - 13}px`;
        $(".legend-small-label").style.left = `${largeDiameter + 30}px`;

        // insert a couple hr elements and use to connect value label to top of each circle
        $("hr.small").style.top = `${largeDiameter - smallDiameter - 10}px`;
        legendControl.addTo(map);
    }




    // create Leaflet control for the legend
    const legendControl = L.control({
        position: "bottomright",
    });

    // when the control is added to the map
    legendControl.onAdd = function () {
        // select the legend using id attribute of legend
        const legend = L.DomUtil.get("legend");

        // disable scroll and click functionality
        L.DomEvent.disableScrollPropagation(legend);
        L.DomEvent.disableClickPropagation(legend);

        // return the selection
        return legend;
    };

    legendControl.addTo(map);

    function retrieveInfo(antiLayer) {
        // select the element and reference with variable
        const info = document.querySelector("#info");

        // since anti is on top, use to detect mouseover events
        antiLayer.on("mouseover", function (e) {

            // access properties of target layer
            const props = e.layer.feature.properties;

            // create a function with a short name to select elements
            const $ = function (x) {
                return document.querySelector(x);
            };

            // populate HTML elements with relevant info
            $("#info span") = props.Locality;
            $(".pro span:first-child") = `(Pro-RCV Votes:${Pro})`;
            $(".boys span:first-child") = `(Anti-RCV Votes: ${Anti})`;
          

            // raise opacity level as visual affordance
            e.layer.setStyle({
                fillOpacity: 0.6,
            });
        });
    }

})();
