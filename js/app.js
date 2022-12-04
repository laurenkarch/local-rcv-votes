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

    var mymap = L.map("map", {
        zoomSnap: 0.1,
        center: [37.8, -96],
        zoom: 4,
        zoomControl: false,
        minZoom: 1,
        maxZoom: 9,
    });
   

    let myData = {}
    omnivore
        .csv("data/RCV_Data.csv")
        .on("ready", function (e) {
            console.log(e.target.toGeoJSON());
            myData = e.target.toGeoJSON();
            console.log(myData.features);
            for (let i of myData.features) {
                console.log(i)
                console.log(i.properties.Pro)
                console.log(i.properties.Anti)
                console.log(i.geometry.coordinates[0]) //long
                console.log(i.geometry.coordinates[1]) //lat

            }
            for (let i of myData.features) {
                var center = [(i.geometry.coordinates[1]), (i.geometry.coordinates[0])];

                
               /* var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                }).addTo(map);*/

                // Create a barchart
                var myPieChart = L.minichart(center, { 
                    // Add options here
                    data: [(i.properties.Pro), (i.properties.Anti)],
                    type: 'pie', 
                })

                mymap.addLayer(myPieChart);
            }


        })
        .on("error", function (e) {
            console.log(e.error[0].message);

        });


    function drawMap(data) {
        const options = {
            pointToLayer: function (feature, ll) {
                return L.circleMarker(ll, {
                    opacity: 1,
                    weight: 1,
                    fillOpacity: .5,

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




    console.log(myData);

})();
