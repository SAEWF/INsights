import firebase from '../../lib/firebase/firebase';


var creation = true;
const DeleteArtTokenInFB = async (WalletAddress, tokenId) => {
    console.log("DeleteArtTokenInFB", WalletAddress, tokenId);
    const db = firebase.firestore();
    const docID = await getDocIDFromFB(WalletAddress, tokenId);
    if(docID!==""){
        if(creation){
            await db.collection('nfts').doc(WalletAddress).collection('Creations').doc(docID).delete().then(()=>{
                console.log("Deleted");
            }).catch((error)=>{
                console.log("Error deleting document: ", error);
            });
        }
        else{
            await db.collection('nfts').doc(WalletAddress).collection('Collections').doc(docID).delete().then(()=>{
                console.log("Deleted");
            })
            .catch((error)=>{
                console.log(error);
            });
        }
    }
    else{
        console.log("No document found");
    }
}

const getDocIDFromFB = async (walletID, tokenId)=>{
    const db = firebase.firestore();
    var docID ="";
    var docRef = db.collection('nfts').doc(walletID).collection('Creations').orderBy('id','desc');
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

  export default DeleteArtTokenInFB;