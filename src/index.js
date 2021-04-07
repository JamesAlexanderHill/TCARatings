import firebase from "firebase/app";

import "firebase/auth";
import "firebase/firestore";
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'

const firebaseConfig = {
    apiKey: "AIzaSyAL-Jeu4Ck0gRc35Ga-cYNgCxVYhf9TVbk",
    authDomain: "tca-ratings.firebaseapp.com",
    projectId: "tca-ratings",
    storageBucket: "tca-ratings.appspot.com",
    messagingSenderId: "64357630658",
    appId: "1:64357630658:web:3011d2c8a5f12c7206b15b"
};
firebase.initializeApp(firebaseConfig);
firebase.auth().useDeviceLanguage();

var ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start('#firebaseui-auth-container', {
    signInSuccessUrl: '/map',
    signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
});
//get data from database (centres, coaches, players)
//load map