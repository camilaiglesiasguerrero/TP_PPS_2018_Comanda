import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

var config:{
  apiKey: "AIzaSyAnE6W3ywQEIjYPeIM6pbKoTR6ad0yFLvc",
  authDomain: "appcomanda-2db93.firebaseapp.com",
  databaseURL: "https://appcomanda-2db93.firebaseio.com",
  projectId: "appcomanda-2db93",
  storageBucket: "appcomanda-2db93.appspot.com",
  messagingSenderId: "144088168430"
};

admin.initializeApp(config);

export const helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

exports.newSubscriberNotification = functions.firestore
  .document('notifications/{notificationId}')
  .onCreate( async event =>{

    const data = event.data();
    console.log("data userid" + data.userId);
    console.log("data token" + data.rol);
    console.log('data cliente' + data.clientName);

    const userId = data.userId;
    const rol = data.rol;
    const cliente = data.clientName;


    const payload = {
      notification:{
        title: 'Lista de espera',
        body: `El cliente ${cliente} solicito una mesa`,
        icon: 'https://goo.gl/Fz9nr0',
        color: '#197db7',
        sound: 'true'
      }
    };

    const db = admin.firestore();
    db.settings({timestampsInSnapshots: true});
    const devicesRef= db.collection('devices');

    const devices = await devicesRef.get();

    const tokens = [];

    console.log("antes del foreach");
    console.log("devices", devices);
    devices.forEach(result =>{
      console.log("entro al foreach");
      console.log("resulta data", result.data());
      const token = result.data().token;
      tokens.push(token);
    });
    console.log(tokens);

    console.log("despues del foreach");
    const mitoken = "d-Kc1xply7g:APA91bFi9ARAbES03JcobPIySm9vamajCb4oBQYdO6k-bvdVVS4ocGbpJdtaciyQQNU_yHZAatqTFUx_vzq_HTpP0IoNQBwx2cjPVea-EISbuonmwGh3qGVMl3dWK1BtZwStgsWEOZNp";
    console.log("mi token" + mitoken);
    console.log(payload);

    return admin.messaging().sendToDevice(mitoken, payload);

  });


