import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

var config:{
  apiKey: "AIzaSyD1cXDgLSPQ2IDMBWlSfGVyh-NdKr-sWzY",
  authDomain: "appcomanda-75a1b.firebaseapp.com",
  databaseURL: "https://appcomanda-75a1b.firebaseio.com",
  projectId: "appcomanda-75a1b",
  storageBucket: "appcomanda-75a1b.appspot.com",
  messagingSenderId: "147175256636"
};

admin.initializeApp(config);

export const helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

exports.newSubscriberNotification = functions.firestore
  .document('notifications2/{notificationId}')
  .onCreate( async event =>{

    const data = event.data();
    console.log("data title" + data.title);
    console.log("data body" + data.body);

    console.log("data devices" + data.devices);

    const title = data.title;
    const body = data.body;
    const devices = data.devices;

    const payload = {
      notification:{
        title: title,
        body: body,
        icon: 'https://goo.gl/Fz9nr0',
        color: '#197db7',
        sound: 'true'
      }
    };
    const tokens = [];
    devices.forEach(device =>{
      console.log("entro al foreach");
      console.log("device", device);
      tokens.push(device);
    });

    console.log("tokens", tokens);


    // const db = admin.firestore();
    // db.settings({timestampsInSnapshots: true});

    // const devicesRef= db.collection('devices');
    //
    // const devices = await devicesRef.get();
    //
    // const tokens = [];

    // console.log("antes del foreach");
    // console.log("devices", devices);
    // devices.forEach(result =>{
    //   console.log("entro al foreach");
    //   console.log("resulta data", result.data());
    //   const token = result.data().token;
    //   tokens.push(token);
    // });
    // console.log(tokens);


   // const mitoken = "d-Kc1xply7g:APA91bFi9ARAbES03JcobPIySm9vamajCb4oBQYdO6k-bvdVVS4ocGbpJdtaciyQQNU_yHZAatqTFUx_vzq_HTpP0IoNQBwx2cjPVea-EISbuonmwGh3qGVMl3dWK1BtZwStgsWEOZNp";

    console.log("payload", payload);

    return admin.messaging().sendToDevice(tokens, payload);

  });


