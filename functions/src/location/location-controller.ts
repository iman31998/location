import * as functions from 'firebase-functions';
//import {user } from './location';
import { db } from '../index'
//const path = require('path');
//const os = require('os');
//const fs = require('fs');
//const Busboy = require('busboy');
//const userCollection = 'users';
const locationRef = db.collection('users');
//remove array and a change it to object of id and location
let arrayOfIDs = [];
let arrayOfLocation = [];
exports.readLocation = functions.https.onCall((data, context) => {
  return locationRef.get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        var userData = doc.data();
        arrayOfIDs.push(doc.id);
        arrayOfLocation.push(userData.location);
        console.log(doc.id);
        console.log(doc.id, '=>', userData.location);
      });
    })
    .catch(err => {
      console.log('Error getting documents', err);

    });
});
var service = new google.maps.DistanceMatrixService();

exports.findDistance = functions.https.onCall((data, context) => {

  /*firestore.document('users/location').onWrite((change, context) => {
      console.log("there is change");*/
});

