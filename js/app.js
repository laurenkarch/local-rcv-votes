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

    var map = L.map("map", {
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
                    width:  0.075 * (Math.sqrt(i.properties.Pro)+Math.sqrt(i.properties.Anti)),
                    colors: ['#7fbf7b','#fffff'],

                    
                })
                map.addLayer(myPieChart);
                var popup = L.popup()
                .setContent("I am a popup.");
            
            myPieChart.bindPopup(popup).openPopup();            }

        })
        .on("error", function (e) {
            console.log(e.error[0].message);

        });
    
        
    let otherData = {}
    omnivore
        .csv("data/RCV_Other.csv")
        .on("ready", function (e) {
            var markerOptions = {
                radius: 5,
                fillColor: "#008837",
                color: "#000",
                weight: 0,
                opacity: 0.75,
                fillOpacity: 0.75
            };
        
            console.log(e.target.toGeoJSON());
            otherData = e.target.toGeoJSON();
            L.geoJSON(otherData, {
                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, markerOptions);}
                }).addTo(map);
        

                
        })
       

})




    ();
