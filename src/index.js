import dotenv from 'dotenv';

import firebase from 'firebase/app';
import 'firebase/firestore';

import { Loader } from '@googlemaps/js-api-loader';

import { from, forkJoin, of, combineLatest, bindNodeCallback, fromEvent } from 'rxjs';
import { map, tap, mergeMap } from 'rxjs/operators';

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
            var mapStyles = [
                {
                    featureType: "poi.business",
                    stylers: [{ visibility: "off" }],
                },
                {
                    featureType: "transit",
                    elementType: "labels.icon",
                    stylers: [{ visibility: "off" }],
                },
            ];
            const mapOptions = {
                center: {
                    lat: -33.7813976,
                    lng: 151.102415
                },
                zoom: 11,
                mapTypeId: 'hybrid',
                mapTypeControl: false,
            };
            const map = new google.maps.Map(document.getElementById("map"), mapOptions);
            map.setOptions(mapStyles);
            return map
        })
    );

//Get data from database
const centres$ = from(db.collection('centres').get())
.pipe(
    map((querySnapshot) => {
        const tempDoc = []
        querySnapshot.docs.map((doc) => {
            tempDoc.push({ id: doc.id, ...doc.data() });
        });
        return tempDoc;
    })
);

// Merge data and initiate map once everything has been resolved
const initData$ = combineLatest([googleMaps$, centres$]);
initData$.subscribe((data) => {
    console.log(data);
    const [map, centres] = data;
    addMarkers(map, centres);
});

let markers = [];
const addMarkers = (map, centres) => {
    //loop through centres
    for(let i = 0; i < centres.length; i++){
        //add marker
        const marker = new google.maps.Marker({
            position: {lat: centres[i].location._lat,lng: centres[i].location._long},
            map,
            title: centres[i].name,
        });
        marker.set("id", centres[i].id);
        markers.push(marker);
        //add event listener
        // const markerEvent$ = fromEvent(marker, 'click').subscribe(event => console.log(event)); //TODO: get working!!!
        const clicks = fromEvent(marker, 'click').subscribe(x => console.log('test', x));
    }
    console.log(markers);
};

const showCentreDetails = (map, marker, centre, coaches) => {
    console.log(centre.id);
    map.setZoom(20);
    map.setCenter(marker.getPosition());

    //update content
    document.getElementById('centerName').innerHTML = centre.name;
    //show content
    document.getElementById("modal").style.display = 'block';
};