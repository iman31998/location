import * as functions from 'firebase-functions';
import axios from 'axios';
import { user } from './location';
import { db } from '../index'
var geoDist = require('geodist')
//reading the user that are clocked in 
const getClockInUsers = () => {
  const query = db.collection('users').where('clockIn', '==', true);
  return query.get()
}

//calculating the distance for all users 
exports.calculateShortestDistance = functions.https.onCall((data, context) => {
  const userInfo: user[] = [];
  let originLocations = '';
  let url = '';
  const dist = {lat:2,lang:4}
  const base = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=metric';
  const destinations = '&destinations=2,4';
  console.log('first ');
  getClockInUsers()
    .then((res) => {
      res.forEach((origins) => {
        const { lat, lang } = origins.get('location')
        console.log({lat,lang});
        let distances = geoDist({ lat, lang },dist)
        console.log('distance using geoDistance = ', distances);
        if (distances < 5000){
        const id = origins.id;
        userInfo.push({ id: id, location: { lat, lang }, distance: 0 })
        originLocations += `${lat}${lang}|`;
        }
      });
      const origin = `&origins=${originLocations.slice(0, -1)}`;
      url = `${base}${origin}${destinations}}&key=AIzaSyA4XgId33NFGn1a8oZd_tT2SLYC6NCFfJs`
      axios.get(url)
        .then((resp) => {
          console.log('res is ', resp);
          const { rows } = resp.data;
          return rows;
        })
        .catch((err) => {
          console.log('distanceMatrix', err);
        })

    })
    .catch((error) => {
      console.log('calculateShortestDistance', error);
    })
  return userInfo;
});
exports.distance = functions.https.onCall((data,context)=>{
  const userInfo: user[] = [];
    const dist = {lat:2,lang:4}
  getClockInUsers()
  .then((res) => {
    res.forEach((origins) => {
      const { lat, lang } = origins.get('location')
      console.log(`lat = ${lat} lang = ${lang}}`);
      let distances = geoDist({ lat, lang },dist)
      console.log('distance using geoDistance = ', distances);
      if (distances < 5000){
      const id = origins.id;
      userInfo.push({ id: id, location: { lat, lang }, distance: 0 })
      }
    });
  })
  .catch((err)=>{
    console.log('calculateShortestDistance',err);
});
return userInfo;
})