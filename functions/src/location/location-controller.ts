import * as functions from 'firebase-functions';
import { user } from './location';
import { db } from '../index'
const locationRef = db.collection('users');
const distance = require('google-distance-matrix');
const response = {
  "status": "",
  "origin_addresses": [],
  "destination_addresses": [],
  "rows": [
    {
      "elements": [
        {
          "status": "",
          "duration": {
            "value": 0,
            "text": ""
          },
          "distance": {
            "value": 0,
            "text": ""
          }
        }
      ]
    }
  ]
}


distance.key('AIzaSyA4XgId33NFGn1a8oZd_tT2SLYC6NCFfJs');
distance.mode('driving');
async function readLocation() {
  const userInfo: user[] = [];
  locationRef.get()
    .then(snapshot => {
      return new Promise((resolve, reject) => {
        snapshot.filter(i=>
           return i.clockIn === true )
          .forEach(doc => {
          const userData = doc.data();
          var u: user = { id: '', location: { lang: '', lat: '' }, distance: 0 };
            u = { id: doc.id, location: { lang: userData.location.lang, lat: userData.location.lat }, distance: 0 };
            userInfo.push(u);
          resolve(userInfo);
          console.log(doc.id, '=>', u.location);
        });
      })
      console.log('test');
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
}

exports.findDistance = functions.https.onCall((data, context) => {
  var base = "https://maps.googleapis.com/maps/api/distancematrix/json?units=metric";
  var destinations = '&destinations=2,4';
  var origins = '&origins=';
  var key = "&key=AIzaSyA4XgId33NFGn1a8oZd_tT2SLYC6NCFfJs";
  readLocation()
    .then(result => {
      result.forEach((i) => {
        origins += i.location.lang + ',' + i.location.lat + '|'
      })
      /*let req ={
        source :[] = origins,
        destination: [] = destinations
      }*/
      /*let data = {
        method: 'post',
        body: req,
      }*/
      var url = base + origins + destinations + key;
      //var request = new Request(url,data);
      let ss: any = null;
      const distances = fetch(url).then(res => {res.json();
      })
      .then(data => {
        data.forEach(i => {
          response.rows[0].elements[0].distance = i.distance;
          response.rows[0].elements[0].duration = i.duration;
          response.rows[0].elements[0].status = i.status;
        });
      })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err));
});


