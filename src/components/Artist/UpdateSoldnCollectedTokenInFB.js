// --this file used to Update Art Token In Firebase when artists list nft for sell. imported in src\reducer\async\actions.ts--
import firebase from '../../lib/firebase/firebase';

const UpdateSoldnCollectedTokenInFB = async (buyerWallAdd,sellerWallAdd,tokenId)=>{
    // testing
    // console.log(buyerWallAdd);
    // console.log(sellerWallAdd);
    // console.log(tokenId);

    const docID = await getDocIDFromFB(sellerWallAdd, tokenId);


    if(docID==="") return;

    const db = firebase.firestore();
    var document  = db.collection('nfts').doc(sellerWallAdd).collection('Creations').doc(docID);
    var nft = await document.get().then((doc) => {
      if (doc.exists) {
        console.log("Document data:", doc.data());
        const data = doc.data();
        return data;
      }
      else {
        console.log("No such document!");
      }
    }).catch(function(error) {
      console.log("Error getting document:", error);
    });

    if(nft===undefined){
      console.log("No such document!");
      return;
    }

    await db.collection('nfts').doc(buyerWallAdd).collection('Collections').add(nft).then(function(docRef) {
      console.log('Document uploaded to Firestore', docRef.id);
    });

    await db.collection('nfts').doc(sellerWallAdd).collection('Creations').doc(docID).delete().then(function() {
      console.log("Document successfully deleted!");
    }).catch(function(error) {
      console.error("Error removing document: ", error);
    });

    return null;
};

const getDocIDFromFB = async (walletID, tokenId)=>{
  const db = firebase.firestore();
  var docID ="";
  var docRef = db.collection('nfts').doc(walletID).collection('Creations');
  await docRef.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      if(doc.data().id === tokenId){
        console.log(doc.id);
        docID = doc.id;
        return doc.id;
      }
    });
  }, (error) => {
    console.log("Error getting documents: ", error);
  });
  return docID;
}

export default UpdateSoldnCollectedTokenInFB;

// system.tzPublicKey actions.ts:540
// tz1LjLHwTthS3DU542igtZfqQCaiM7fz9C2C actions.ts:541
// tz1QBAh8mGg8CD28JritfHM7e7evaqKVyDcT actions.ts:542
// 76432399781 actions.ts:543
