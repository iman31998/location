import axios from 'axios';
import * as functions from 'firebase-functions';
import { db } from '../index';
import { user } from './location';
const geoDist = require('geodist')
const distanceLimit = 5000;
//reading the user that are clocked in 
const getClockInUsers = () => {
  const query = db.collection('users').where('clockIn', '==', true);
  return query.get()
}
//calculating the distance for all users 
exports.calculateShortestDistance = functions.https.onCall((data, context) => {
  let randomUser: user = {id:'',distance:0};
  const { lat, long } = data.destination;
  console.log(`lat = ${lat} lng = ${long}`);
  console.log('context',context);
  const userInfo: user[] = [];
  //let shortestDistanceUser: user = { id: '', distance: 0 };
  let originLocationsForDistanceMatrixAPI = '';
  //const distanceTest = { latitude: 2, longitude: 4 }
  let urlForDistanceMatrixApi = '';
  const baseForDistanceMatrixApi = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=metric';
  //const destinationForDistanceMatrixApiTest = '&destinations=2,4';
  const destinationForDistanceMatrixApi = `&destinations=${lat},${long}`
  const random =getClockInUsers()
    .then((res) => {
      res.forEach((origins) => {
        const { latitude, longitude } = origins.get('location')
        if (calculateClosestLocations({ latitude, longitude }, { lat, long }) < distanceLimit) {
          const id = origins.id;
          userInfo.push({ id: id, distance: 0 })
          originLocationsForDistanceMatrixAPI += `${latitude},${longitude}|`;
        } 
        
      });
      console.log('matrix: ', originLocationsForDistanceMatrixAPI); 
      const originsLocation = `&origins=${originLocationsForDistanceMatrixAPI.slice(0, -1)}`;
      urlForDistanceMatrixApi = `${baseForDistanceMatrixApi}${originsLocation}${destinationForDistanceMatrixApi}}&key=AIzaSyA4XgId33NFGn1a8oZd_tT2SLYC6NCFfJs`
      console.log(urlForDistanceMatrixApi);
      
     distanceMatrixApi(urlForDistanceMatrixApi)
        .then((response) => {
         /* const { id, distance } = response;
          shortestDistanceUser = { id: userInfo[parseInt(id)].id, distance: distance };*/
          console.log('response is ', response);
          
        })
        .catch((errors) => {
          console.log("userInfoFormDistanceMatrixApi", errors);
        })
        const randomIndex = Math.floor(Math.random() * userInfo.length); 
        const randomDistance = (Math.random() * 5000);
      randomUser = { id: userInfo[randomIndex].id, distance: randomDistance }
      return randomUser;
    })
    .catch((err) => {
      console.log('calculateShortestDistance', err);
    });
console.log("random user ", random);
return random;

});

const calculateClosestLocations = ({ latitude, longitude }: { latitude: any, longitude: any }, distanceTest: any) => {
  const distanceUsingGeoDistance = geoDist({ latitude, longitude }, distanceTest)
  console.log('distance using geoDistance = ', distanceUsingGeoDistance);
  return distanceUsingGeoDistance;
}
const distanceMatrixApi = (urlForDistanceMatrixApi: any) => {
  const collectionOfShortestDistance = axios.get(urlForDistanceMatrixApi)
    .then((res) => {
      console.log('res is ', res);
      const { rows } = res.data;
      let idForShortestDistance = 0;
      const elementsRows = rows[0].elements;
      let leastDistance = elementsRows[0].elements[1].distance.value;
      let shortestDistance = elementsRows[0].elements[1].distance.text;
      for (let i = 1; i < elementsRows.length; i++) {
        const routeDistance = elementsRows[i].elements[1].distance.value;
        if (leastDistance > routeDistance) {
          leastDistance = routeDistance;
          shortestDistance = elementsRows[i].elements[1].distance.text
          idForShortestDistance = i;
        }
      }
      const userInformation: user = { id: idForShortestDistance.toString(), distance: shortestDistance }
      return userInformation;
    })
  return collectionOfShortestDistance;
}

exports.distance = functions.https.onCall((data, context) => {
  let randomUser: user = {id:'',distance:0};
  const { lat, long } = data.destination;
  console.log(`lat = ${lat} lng = ${long}`);
  const userInfo: user[] = [];
 // const dist = { lat: 2, lang: 4 }
  getClockInUsers()
    .then((res) => {
      res.forEach((origins) => {
        const { latitude, longitude } = origins.get('location')
        console.log(`lat = ${latitude} lang = ${longitude}}`);
        const distances = geoDist({ latitude, longitude }, { lat, long })
        console.log('distance using geoDistance = ', distances);
        if (distances < 5000) {
          const id = origins.id;
          userInfo.push({ id: id, distance: 0 })
          console.log('id = ', userInfo[0].id);
        }
      });
      const index = Math.floor(Math.random() * userInfo.length);
    console.log('index',index)
    console.log('iman',userInfo[index].id);
    randomUser = { id: userInfo[Math.floor(Math.random() * userInfo.length)].id, distance: (Math.random() * 5000) }
    console.log("random user ", randomUser);
    })
    .catch((err) => {
      console.log('calculateShortestDistance', err);
    });
    
  return randomUser;
})


