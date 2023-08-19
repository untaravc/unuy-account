import * as admin from "firebase-admin"
import {App, applicationDefault} from "firebase-admin/app"
import {FirebaseApp, initializeApp} from "firebase/app"

let firebaseApp: App
let firebaseAppClient: FirebaseApp

export const getFirebaseApp = () => firebaseApp
export const getFirebaseAppClient = () => firebaseAppClient

export const firebaseInit = () =>{
    firebaseApp = admin.initializeApp({
        credential: applicationDefault(),
        storageBucket: 'unuy-internal.appspot.com'
    })

    firebaseAppClient = initializeApp({
        apiKey: "AIzaSyDjHT9mdOC4cZr94vFBZHojsScvo1LHz-w",
        authDomain: "unuy-internal.firebaseapp.com",
        projectId: "unuy-internal",
        storageBucket: "unuy-internal.appspot.com",
        messagingSenderId: "379766425148",
        appId: "1:379766425148:web:32ecb3a60945f028c66539",
        measurementId: "G-2ZEGJ62MNY"
    })
}