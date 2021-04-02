import firebase from 'firebase/app';
import 'firebase/firestore';
import { Loader } from '@googlemaps/js-api-loader';

const loader = new Loader({
  apiKey: "AIzaSyAL-Jeu4Ck0gRc35Ga-cYNgCxVYhf9TVbk",
  version: "weekly",
  libraries: ["places"]
});

const mapOptions = {
  center: {
    lat: 0,
    lng: 0
  },
  zoom: 4
};

firebase.initializeApp({
    apiKey: "AIzaSyAL-Jeu4Ck0gRc35Ga-cYNgCxVYhf9TVbk",
    authDomain: "tca-ratings.firebaseapp.com",
    projectId: "tca-ratings",
    storageBucket: "tca-ratings.appspot.com",
    messagingSenderId: "64357630658",
    appId: "1:64357630658:web:3011d2c8a5f12c7206b15b"
});
const db = firebase.firestore();
let map;
loader
  .load()
  .then(() => {
    map = new google.maps.Map(document.getElementById("map"), mapOptions);
  })
  .then(() => {
      console.log('Add Markers');
      addMarkers();
  })
  .catch(e => {
    console.log('Maps Failed to load');
  });





// const map = new google.maps.Map(document.getElementById("map"), {
//     zoom: 4,
//     center: { lat: -25.344, lng: 131.036 },
// });;

// window.addEventListener('load', function() {
//     console.log("getData");
//     console.log(map);
// })
function addMarkers() {
    const marker = new google.maps.Marker({
        position: { lat: -25.363, lng: 131.044 },
        map,
        title: "Click to zoom",
      });
}