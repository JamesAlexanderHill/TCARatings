import dotenv from 'dotenv';
import { Loader } from '@googlemaps/js-api-loader';
import { from, forkJoin, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

dotenv.config();

//Google map observable
const googleMapsLoader = new Loader({
  apiKey: process.env.MAPS_API,
  version: "weekly",
  libraries: ["drawing"]
}).load();
const googleMaps$ = from(googleMapsLoader).pipe(map(() => {
    const mapOptions = {
        center: {
            lat: -33.7813976,
            lng: 151.102415
        },
        zoom: 11
    };
    const map = new google.maps.Map(document.getElementById("map"), mapOptions);
    return map
}));

//Get data from database
const centresData$ = of('Centres').pipe(delay(500));
const coachesData$ = of('Coaches').pipe(delay(1000));
const playersData$ = of('Players').pipe(delay(1500));

//Merge data and initiate map once everything has been resolved
const data$ = forkJoin([googleMaps$, centresData$, coachesData$, playersData$]);
data$.subscribe({
    next: data => initMap(...data)
});

//initialise map
const initMap = (map, centres, coaches, players) => {
    // set Global params
    // add markers
    addMarkers(map, centres);
}

const addMarkers = (map, centres) => {
    console.log("Map: ", map)
    new google.maps.Marker({
        position: {lat: -33.7809197,lng: 150.9624176},
        map,
        title: "Hello World!",
    });
    return true;
}