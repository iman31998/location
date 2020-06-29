import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as bodyParser from "body-parser";
//initialize firebase inorder to access its services
const serviceAccount = require("./location-18036-firebase-adminsdk-kz75l-1928716889.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://location-18036.firebaseio.com",
});
export const db = admin.firestore();
//initialize express server
const app = express();
const main = express();

//add the path to receive request and set json as bodyParser to process the body 
main.use('/api/v1', app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));


//initialize the database and the collection 
exports.mapFunction = require('./location/location-controller')
//define google cloud function name
export const webApi = functions.https.onRequest(main);