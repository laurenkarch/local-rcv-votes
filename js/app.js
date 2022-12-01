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

omnivore.csv("RCV_data.csv").addTo(map);



})();
