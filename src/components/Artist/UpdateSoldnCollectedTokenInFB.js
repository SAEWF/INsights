// --this file used to Update Art Token In Firebase when artists list nft for sell. imported in src\reducer\async\actions.ts--
import firebase from '../../lib/firebase/firebase';


let creation = true;
const UpdateSoldnCollectedTokenInFB = async (buyerWallAdd,sellerWallAdd,tokenId)=>{
    // testing
    // console.log(buyerWallAdd);
    // console.log(sellerWallAdd);
    // console.log(tokenId);

    // getting the ID of NFT token to be transacted
    const docID = await getDocIDFromFB(sellerWallAdd, tokenId);


    if(docID==="") return;

    // getting the NFT data  from firebase
    const db = firebase.firestore();
    var document
    if(creation){
      document  = db.collection('nfts').doc(sellerWallAdd).collection('Creations').doc(docID);
    }
    else{
      document  = db.collection('nfts').doc(sellerWallAdd).collection('Collections').doc(docID);
    }
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

    var existinghistory = nft.history===undefined?[]:nft.history;

    var updatedNFT = {...nft, history: [...existinghistory, {
      seller: sellerWallAdd,
      buyer: buyerWallAdd,
      timestamp: new Date().getTime().toLocaleString("en-US")
    }], sale: null};


    // Creating token in buyer database
    var docname = nft.address+'-'+nft.id;
    await db.collection('nfts').doc(buyerWallAdd).collection('Collections').doc(docname).set(updatedNFT).then(function(docRef) {
      console.log('Document uploaded');
    });

    // Updating token from seller database
    var collectionName = creation?'Creations': 'Collections';
    await db.collection('nfts').doc(sellerWallAdd).collection(collectionName).doc(docID)
    .update({
      "title": "SOLD",
      "history": updatedNFT.history,
      "sale": null
    })
    .then(function() {
      console.log("Document successfully Updated!");
    }).catch(function(error) {
      console.error("Error removing document: ", error);
    });

    return null;
};

const getDocIDFromFB = async (walletID, tokenId)=>{
  const db = firebase.firestore();
  var docID ="";
  var docRef = db.collection('nfts').doc(walletID).collection('Creations').orderBy('id', 'desc');
  await docRef.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      if(doc.data().id === tokenId){
        // console.log(doc.id);
        docID = doc.id;
        return doc.id;
      }
    });
  }, (error) => {
    console.log("Error getting documents: ", error);
  });

  if(docID!=="") return docID;
  creation = false;

  docRef = db.collection('nfts').doc(walletID).collection('Collections').orderBy('id', 'desc');
  await docRef.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      if(doc.data().id === tokenId){
        // console.log(doc.id);
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