import * as functions from 'firebase-functions';
import {user } from './location';
import { db } from '../index'
//const path = require('path');
//const os = require('os');
//const fs = require('fs');
//const Busboy = require('busboy');
const userCollection = 'users';

exports.addlocation = functions.https.onCall(async (data, context)=>{
    if (!context.auth)
        return {message: 'Authentication required', code: 401 };
    const d = data.text;
    const u : user ={
        location:{
            lang: d.location.lang,
            lat: d.location.lat
        }
    }
    const newDoc = await db.collection(userCollection).add(u);
    return {newDoc}
    
});