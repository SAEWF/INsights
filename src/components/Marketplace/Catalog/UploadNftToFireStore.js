// --this file used to Update Upload Nft details To FireStore  when minting of token success, imported in src\reducer\async\actions.ts--
import firebase from '../../../lib/firebase/firebase';
// import * as uuid from "uuid";

const UploadNftToFireStore = async (walletAddress,collection,metadata,file)=>{
    const db = firebase.firestore().collection('nfts');
    // var storageRef = firebase.storage().ref();
    var url = "";

    // console.log("IN FUNCTION",file);

    // await storageRef.child('images/' + file.name).put(file, metadata).on('state_changed', function(snapshot) {
    //     if (snapshot.metadata.state === 'done') {
    //         console.log('Upload done. Metadata:', snapshot.metadata);
    //         var url = snapshot.ref.toString();
    //         var nft = {
    //             "walletAddress": walletAddress,
    //             "collection": collection,
    //             "metadata": metadata,
    //             "url": url,
    //             "fileName": file.name
    //         };
    //         db.doc(walletAddress).collection(collection).add(nft).then(function(docRef) {
    //             console.log('Document uploaded to Firestore:', docRef.id);
    //         });
    //     }
    // });
    
    // var uploadTask = storageRef.child('images/' + uuid.v4()).put(file, metadata);
    // await uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
    // (snapshot) => {
    //     // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    //     var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //     console.log('Upload is ' + progress + '% done');
    //     switch (snapshot.state) {
    //     case firebase.storage.TaskState.PAUSED: // or 'paused'
    //         console.log('Upload is paused');
    //         break;
    //     case firebase.storage.TaskState.RUNNING: // or 'running'
    //         console.log('Upload is running');
    //         break;
    //         case firebase.storage.TaskState.SUCCESS: // or 'success'
    //         console.log('Upload is success');
    //         break;
    //         case firebase.storage.TaskState.CANCELED: // or 'canceled'
    //         console.log('Upload is canceled');
    //         break;
    //         case firebase.storage.TaskState.ERROR: // or 'error'
    //         console.log('Upload is error');
    //         break;
    //     default:
    //         console.log('Upload is in default state');
    //     }
    // }, 
    // (error) => {
    //     switch (error.code) {
    //     case 'storage/unauthorized':
    //         console.log('User does not have permission to access the object.');
    //         break;
    //     case 'storage/canceled':
    //         console.log('User canceled the upload.');
    //         break;
    //     case 'storage/unknown':
    //         console.log('An unknown error occurred.');
    //         break;
    //     default:
    //         console.log('An unknown error occurred.');
    //         break;
    //     }
    // }, 
    // () => {
    //     // Upload completed successfully, now we can get the download URL
    //     uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
    //         // console.log('File available at', downloadURL);
    //         url = downloadURL;
            var nft = {
                "walletAddress": walletAddress,
                "collection": collection,
                "metadata": metadata,
                "url": url,
                "fileName": file.name,
                "fileType": file.type
            };
            await db.doc(walletAddress).collection(collection).add(nft).then(function(docRef) {
                console.log('Document uploaded to Firestore')//, docRef.id);
            });
    //     });
    // }
    // );

    // console.log("UploadNftToFireStore")
    // const data = {
    //     name: 'Los Angeles2',
    //     description: 'CA2',
    //     attributes: {
    //         artist: "5",
    //         tags: "12"
    //     },
    //     collection:"",
    //     token:786,
    //     price:1,
    //     currentState:"buy"
    // };



    // var data ={}
    // data.walletAddress=walletAddress;
    // data.collection=collection;
    // data.name=metadata.name;
    // data.description=metadata.description;
    // data.attributes=metadata.attributes;
    // data.image = url;

    // // Add a new document with a generated id.
    // console.log("DATA", data);
    // await db.add(data)
    // .then((docRef) => {
    //     console.log("Firestore Document written with ID: ", docRef.id);
    // })
    // .catch((error) => {
    //     console.error("Firestore Error adding document: ", error);
    // });

 return null;

};

export default UploadNftToFireStore;

// var docData = {
//     stringExample: "Hello world!",
//     booleanExample: true,
//     numberExample: 3.14159265,
//     dateExample: firebase.firestore.Timestamp.fromDate(new Date("December 10, 1815")),
//     arrayExample: [5, true, "hello"],
//     nullExample: null,
//     objectExample: {
//         a: 5,
//         b: {
//             nested: "foo"
//         }
//     }
// };

