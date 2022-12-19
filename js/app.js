(function () {

    'use strict';
    adjustHeight();
    window.addEventListener("resize", adjustHeight);

    const button = document.querySelector("#legend button");

    button.addEventListener("click", function () {
        const legend = document.querySelector(".leaflet-legend");
        legend.classList.toggle("show-legend");
    });

    function adjustHeight() {
        const mapSize = document.querySelector("#map"),
            contentSize = document.querySelector("#content"),
            removeHeight = document.querySelector("footer").offsetHeight,
            removeHeight2 = document.querySelector("header").offsetHeight,
            resize = window.innerHeight - removeHeight - removeHeight2;

        mapSize.style.height = `${resize}px`;
        console.log(resize);
        if (window.innerWidth >= 768) {
            contentSize.style.height = `${resize}px`;
            mapSize.style.height = `${resize}px`;
        } else {
            contentSize.style.height = `${resize * 0.4}px`;
            mapSize.style.height = `${resize * 0.6}px`;
        }


    }

    var map = L.map("map", {
        zoomSnap: 0.1,
        center: [37.8, -96],
        zoom: 4,
        zoomControl: true,
        minZoom: 1,
        maxZoom: 9,
    });



    // mapbox API parameters
    const accessToken = `pk.eyJ1IjoibGF1cmVua2FyY2giLCJhIjoiY2wzd2RtazQyMnV2azNnbXVvcjBteHcwNyJ9.p4zlCc57GpKUgV8dPr4KxA`
    const yourName = 'laurenkarch'
    const yourMap = 'clbb1oa6o000b14mr6ff3vhiq'

    // request a mapbox raster tile layer and add to map
    L.tileLayer(`https://api.mapbox.com/styles/v1/laurenkarch/clbb1oa6o000b14mr6ff3vhiq/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGF1cmVua2FyY2giLCJhIjoiY2wzd2RtazQyMnV2azNnbXVvcjBteHcwNyJ9.p4zlCc57GpKUgV8dPr4KxA`, {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, and <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18
    }).addTo(map);

  


    let myData = {}
    omnivore
        .csv("data/RCV_Data.csv")
        .on("ready", function (e) {
            console.log(e.target.toGeoJSON());
            myData = e.target.toGeoJSON();
            console.log(myData.features);
            for (let i of myData.features) {
                /*  console.log(i)
                  console.log(i.properties.Pro)
                  console.log(i.properties.Anti)
                  console.log(i.geometry.coordinates[0]) //long
                  console.log(i.geometry.coordinates[1]) //lat*/

            }
            for (let i of myData.features) {
                var center = [(i.geometry.coordinates[1]), (i.geometry.coordinates[0])];

                // Create a barchart
                var myPieChart = L.minichart(center, {
                    // Add options here
                    data: [(i.properties.Pro), (i.properties.Anti)],
                    type: 'pie',
                    width: 0.08 * (Math.sqrt(i.properties.Pro) + Math.sqrt(i.properties.Anti)),
                    colors: ['#7fbf7b', '#fffff'],
                    opacity: 0.75,


                })
                map.addLayer(myPieChart);
                var popup = L.popup()
                    .setContent(`<h3>${i.properties.Locality}, ${i.properties.State}</h3>
                <h3>${i.properties.Name}, ${i.properties.Year}</h3>
                <label>Type of measure:  </label>  ${i.properties.Type}<br>
                <label>Ranked choice elections:  </label>  ${i.properties.Elections}<br>

                <label>Pro-RCV vote percentage:</label> `+ Math.round(100 * Number(i.properties.Pro) / (Number(i.properties.Pro) + Number(i.properties.Anti))) +
                        `% <br>${i.properties.Notes}`);

                myPieChart.bindPopup(popup);
            }

        })
        .on("error", function (e) {
            console.log(e.error[0].message);

        });





    let otherData = {}
    omnivore
        .csv("data/RCV_Other.csv")
        .on("ready", function (e) {
            console.log(e.target.toGeoJSON());
            otherData = e.target.toGeoJSON();
            console.log(myData.features);
            for (let i of otherData.features) {
                /*  console.log(i)
                  console.log(i.properties.Pro)
                  console.log(i.properties.Anti)
                  console.log(i.geometry.coordinates[0]) //long
                  console.log(i.geometry.coordinates[1]) //lat*/

            }
            for (let i of otherData.features) {
                var center = [(i.geometry.coordinates[1]), (i.geometry.coordinates[0])];

                // Create a barchart
                var cityMarker = L.circleMarker(center, {
                    // Add options here
                    center: [(i.properties.Pro), (i.properties.Anti)],
                    radius: 5,
                    fillColor: "#008837",
                    color: "#000",
                    weight: 0,
                    opacity: 0.75,
                    fillOpacity: 0.75,
                    opacity: 0.75,


                })
                map.addLayer(cityMarker);
                var popup = L.popup()
                    .setContent(`<h3>${i.properties.Locality}, ${i.properties.State}</h3>    
                    <label>RCV established without recent ballot initiative.</label><br>
                    <label>Ranked choice elections:  </label>  ${i.properties.Elections}<br>
${i.properties.Notes}`);

                cityMarker.bindPopup(popup);
            }

        })
        .on("error", function (e) {
            console.log(e.error[0].message);

        });



})









();
