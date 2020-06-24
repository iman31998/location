import * as functions from 'firebase-functions';
//import {user } from './location';
import { db } from '../index'
//const path = require('path');
//const os = require('os');
//const fs = require('fs');
//const Busboy = require('busboy');
//const userCollection = 'users';
//const locationRef = db.collection('users').doc('location');
/*let getDoc = locationRef.get()
  .then(doc => {
    if (!doc.exists) {
      console.log('No such document!');
    } else {
      console.log('Document data:', doc.data());
    }
  })
  .catch(err => {
    console.log('Error getting document', err);
  });*/
exports.readLocation = functions.https.onCall((data, context)=>{
    const locationRef = db.collection('users');
    return locationRef.get()
  .then(snapshot => {
    snapshot.forEach(doc => {
      console.log(doc.id, '=>', doc.data());
    });
  })
  .catch(err => {
    console.log('Error getting documents', err);
  });   
});
/*locationRef.listCollections().then(collections => {
    collections.forEach(collection => {
      console.log('Found subCollection with id:', collection.id);
    });
  });
  return {console.log(data.text)};*/
  /*exports.findDistance = functions.firestore
    .document('users/location').onWrite((change, context) => {
      // ... Your code here
    });*/