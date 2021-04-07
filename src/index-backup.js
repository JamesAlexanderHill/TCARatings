import firebase from 'firebase/app';
import 'firebase/firestore';
import { collection } from 'rxfire/firestore';
import { from, combineLatest } from 'rxjs';
import { startWith , map } from 'rxjs/operators';

import { Loader } from '@googlemaps/js-api-loader';
 
const app = firebase.initializeApp({
    apiKey: "AIzaSyAL-Jeu4Ck0gRc35Ga-cYNgCxVYhf9TVbk",
    authDomain: "tca-ratings.firebaseapp.com",
    projectId: "tca-ratings",
    storageBucket: "tca-ratings.appspot.com",
    messagingSenderId: "64357630658",
    appId: "1:64357630658:web:3011d2c8a5f12c7206b15b"
});

// get initial database values
const centresRef = app.firestore().collection('centres');
const coachesRef = app.firestore().collection('coaches');
const playersRef = app.firestore().collection('players');

// create streams
var centres$ = collection(centresRef)
  .pipe(map(centres => centres.map(c => c.data())));
var coaches$ = collection(coachesRef)
  .pipe(map(coaches => coaches.map(c => c.data())));;
var players$ = collection(playersRef)
  .pipe(map(players => players.map(c => c.data())));;


centres$.subscribe(data => console.log(data));
coaches$.subscribe(data => console.log(data));
players$.subscribe(data => console.log(data));
// data$.subscribe(data => console.log(data));

// google maps
const loader = new Loader({
    apiKey: "AIzaSyAL-Jeu4Ck0gRc35Ga-cYNgCxVYhf9TVbk",
    version: "weekly",
    libraries: ["places"]
});
const map$ = from(loader.load().then(() => {
    const mapOptions = {
        center: {
            lat: 0,
            lng: 0
        },
        zoom: 4
    };
    return new google.maps.Map(document.getElementById("map"), mapOptions);
}));
map$.subscribe(data => console.log(data));


var dataLoaded$ = combineLatest([centres$, coaches$, players$, map$])
.pipe(
    map((data) => {
        return true;
    // console.log('finished loading data');
    // debugger;
    // const [centres, coaches, players, map] = data;
    // const markers = addMarkers(map, centres);



    //
    // return [
    //     //spread the arrays out to combine as one array
    //     ...centres,
    //     ...coaches,
    //     ...players,
    //     ...map
    // ];
    })
);


dataLoaded$.subscribe(val => console.log(val));


function addMarkers(map, centres){
    const markerArr = [];
    centres.map((centre) => {
        const marker = new google.maps.Marker({
            position: new google.maps.LatLng(centre.location._lat,centre.location._long),
            title:centre.name
        });
        marker.addListener("click", () => {
            console.log('Clicked', centre.name);
        });
        markerArr.push(marker);
    });
    return markerArr;
}














 
// collectionData(coachesRef, 'id')
//   .pipe(
//     tap(cities => console.log('This is just an observable!'))
//   )
//   .subscribe(cities => { /* update UI */ })





// import firebase from 'firebase/app';
// import 'firebase/firestore';
// import { Loader } from '@googlemaps/js-api-loader';

// const loader = new Loader({
//   apiKey: "AIzaSyAL-Jeu4Ck0gRc35Ga-cYNgCxVYhf9TVbk",
//   version: "weekly",
//   libraries: ["places"]
// });

// const mapOptions = {
//   center: {
//     lat: 0,
//     lng: 0
//   },
//   zoom: 4
// };

// firebase.initializeApp({
//     apiKey: "AIzaSyAL-Jeu4Ck0gRc35Ga-cYNgCxVYhf9TVbk",
//     authDomain: "tca-ratings.firebaseapp.com",
//     projectId: "tca-ratings",
//     storageBucket: "tca-ratings.appspot.com",
//     messagingSenderId: "64357630658",
//     appId: "1:64357630658:web:3011d2c8a5f12c7206b15b"
// });
// const db = firebase.firestore();
// let map;
// loader
//   .load()
//   .then(() => {
//     map = new google.maps.Map(document.getElementById("map"), mapOptions);
//   })
//   .then(() => {
//       console.log('Add Markers');
//       addMarkers();
//   })
//   .catch(e => {
//     console.log('Maps Failed to load');
//   });





// // const map = new google.maps.Map(document.getElementById("map"), {
// //     zoom: 4,
// //     center: { lat: -25.344, lng: 131.036 },
// // });;

// // window.addEventListener('load', function() {
// //     console.log("getData");
// //     console.log(map);
// // })
// function addMarker(markerObj) {

//     const marker = new google.maps.Marker({
//         position: { lat: markerObj.latitude, lng: markerObj.longitude },
//         map,
//         title: markerObj.name,
//     });
// }