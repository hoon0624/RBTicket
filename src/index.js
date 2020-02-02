import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// import * as serviceWorker from './serviceWorker';

import firebase from "@firebase/app";
import '@firebase/firestore';

// Your web app's Firebase configuration
var firebaseConfig = {
apiKey: "AIzaSyCtJ35bIecETsEd0jRNPSC38E0HW1SCAxc",
authDomain: "rb-tickets-node-267006.firebaseapp.com",
databaseURL: "https://rb-tickets-node-267006.firebaseio.com",
projectId: "rb-tickets-node-267006",
storageBucket: "rb-tickets-node-267006.appspot.com",
messagingSenderId: "506231512400",
appId: "1:506231512400:web:5bd7d96fe06a4d627ee055",
measurementId: "G-3S8VVQ579S"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();

ReactDOM.render(<App db={db} />, document.getElementById('root'));

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
