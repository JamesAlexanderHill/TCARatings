import dotenv from 'dotenv';

import firebase from 'firebase/app';
import 'firebase/firestore';

import { Loader } from '@googlemaps/js-api-loader';

import { from, forkJoin, of, combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { collectionData } from 'rxfire/firestore';

dotenv.config();

//Firebase setup
const firebaseConfig = {
    apiKey: process.env.FIREBASE_APIKEY,
    authDomain: process.env.FIREBASE_AUTHDOMAIN,
    projectId: process.env.FIREBASE_PROJECTID,
    storageBucket: process.env.FIREBASE_STORAGEBUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
    appId: process.env.FIREBASE_APPID
};
const app = firebase.initializeApp(firebaseConfig);
const db = app.firestore();

//Google map observable
const googleMapsLoader = new Loader({
  apiKey: process.env.MAPS_API,
  version: "weekly",
  libraries: []
}).load();
const googleMaps$ = from(googleMapsLoader)
    .pipe(
        map(() => {
            const mapOptions = {
                center: {
                    lat: -33.7813976,
                    lng: 151.102415
                },
                zoom: 11
            };
            const map = new google.maps.Map(document.getElementById("map"), mapOptions);
            return map
        })
    );

//Get data from database
const centresRef = db.collection('centres');
const coachesRef = db.collection('coaches');
const playersRef = db.collection('players');

const centres$ = collectionData(centresRef, 'id');
const coaches$ = collectionData(coachesRef, 'id');
const players$ = collectionData(playersRef, 'id');

//Merge data and initiate map once everything has been resolved
const data$ = combineLatest([googleMaps$, centres$, coaches$, players$]);
data$.subscribe({
    next: data => {
        console.log("data$", data);
        initMap(...data);
    },
    complete: () => console.log('This is how it ends!'),
});

//initialise map
const initMap = (map, centres, coaches, players) => {
    addMarkers(map, centres);
}

//Add markers to the map
const addMarkers = (map, centres) => {
    
    // console.log("Map: ", map)
    // new google.maps.Marker({
    //     position: {lat: -33.7809197,lng: 150.9624176},
    //     map,
    //     title: "Hello World!",
    // });
    
    //loop through all the centres
    for(let i = 0; i < centres.length; i++){
        //add marker
        const marker = new google.maps.Marker({
            position: {lat: centres[i].location._lat,lng: centres[i].location._long},
            map,
            title: centres[i].name,
        });
        
        //add event listener
        marker.addListener("click", () => {
            showCentreDetails(map, marker, centres[i].id);
        });
    }
}

const showCentreDetails = (map, marker, id) => {
    console.log(id);
    map.setZoom(20);
    map.setCenter(marker.getPosition());
};