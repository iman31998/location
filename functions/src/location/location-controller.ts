import axios from 'axios';
import * as functions from 'firebase-functions';
import { db } from '../index';
import { user } from './location';
const geoDist = require('geodist')
//reading the user that are clocked in 
const getClockInUsers = () => {
  const query = db.collection('users').where('clockIn', '==', true);
  return query.get()
}
//calculating the distance for all users 
exports.calculateShortestDistance = functions.https.onCall((data, context) => {
  const userInfo: user[] = [];
  let originLocationsForDistanceMatrixAPI = '';
  const distanceTest = { latitude: 2, longitude: 4 }
  let urlForDistanceMatrixApi = '';
  const baseForDistanceMatrixApi = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=metric';
  const destinationForDistanceMatrixApi = '&destinations=2,4';
  getClockInUsers()
    .then((res) => {
      res.forEach((origins) => {
        const { latitude, longitude } = origins.get('location')
        let distanceUsingGeoDistance = geoDist({ latitude, longitude }, distanceTest)
        console.log('distance using geoDistance = ', distanceUsingGeoDistance);
        if (distanceUsingGeoDistance < 5000) {
          const id = origins.id;
          userInfo.push({ id: id, location: { latitude, longitude }, distance: 0 })
          originLocationsForDistanceMatrixAPI += `${latitude},${longitude}|`;
        }
      });
      const origins = `&origins=${originLocationsForDistanceMatrixAPI.slice(0, -1)}`;
      urlForDistanceMatrixApi = `${baseForDistanceMatrixApi}${origins}${destinationForDistanceMatrixApi}}&key=AIzaSyA4XgId33NFGn1a8oZd_tT2SLYC6NCFfJs`
      axios.get(urlForDistanceMatrixApi)
        .then((res) => {
          console.log('res is ', res);
          const { rows } = res.data;
          return rows;
        })
        .catch((err) => {
          console.log('distanceMatrix', err);
        })

    })
    .catch((err) => {
      console.log('calculateShortestDistance', err);
    });
  return userInfo;
});

exports.distance = functions.https.onCall((data,context)=>{
  const userInfo: user[] = [];
    const dist = {lat:2,lang:4}
  getClockInUsers()
  .then((res) => {
    res.forEach((origins) => {
      const { latitude, longitude } = origins.get('location')
      console.log(`lat = ${latitude} lang = ${longitude}}`);
      const distances = geoDist({ latitude, longitude },dist)
      console.log('distance using geoDistance = ', distances);
      if (distances < 5000){
      const id = origins.id;
      userInfo.push({ id: id, location: { latitude, longitude }, distance: 0 })
      }
    });
  })
  .catch((err)=>{
    console.log('calculateShortestDistance',err);
});
return userInfo;
})