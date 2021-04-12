import dotenv from 'dotenv';
import { Loader } from '@googlemaps/js-api-loader';

dotenv.config();
const map = null;
const googleMapsLoader = new Loader({
  apiKey: process.env.MAPS_API,
  version: "weekly",
  libraries: ["drawing"]
}).load();

const mapOptions = {
  center: {
    lat: -33.7809197,
    lng: 150.9624176
  },
  zoom: 11
};

googleMapsLoader
  .then(() => {
    map = new google.maps.Map(document.getElementById("map"), mapOptions);
    console.log("Map Loaded");
  })
  .then(() => {
      addMarkers(map);
      console.log("Markers Added");
  })
  .catch(e => {
    // do something
  });

const addMarkers = (map) => {
    console.log("Map: ", map)
    new google.maps.Marker({
        position: {lat: -33.7809197,lng: 150.9624176},
        map,
        title: "Hello World!",
    });
    return true;
}