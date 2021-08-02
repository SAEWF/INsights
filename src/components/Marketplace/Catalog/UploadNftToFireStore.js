// --this file used to Update Upload Nft details To FireStore  when minting of token success, imported in src\reducer\async\actions.ts--
import firebase from '../../../lib/firebase/firebase';

const UploadNftToFireStore = async (walletAddress,collection,metadata)=>{
    const db = firebase.firestore().collection('nfts');

    console.log("UploadNftToFireStore")
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
    var data ={}
    data.walletAddress=walletAddress;
    data.collection=collection;
    data.name=metadata.name;
    data.description=metadata.description;
    data.attributes=metadata.attributes;

    // Add a new document with a generated id.
    await db.add(data)
    .then((docRef) => {
        console.log("Firestore Document written with ID: ", docRef.id);
    })
    .catch((error) => {
        console.error("Firestore Error adding document: ", error);
    });

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

