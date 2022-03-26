// --this file used to Update Upload Nft details To FireStore  when minting of token success, imported in src\reducer\async\actions.ts--
import firebase from '../../../lib/firebase/firebase';

const UploadNftToFireStore = async (walletAddress,collection,metadata, token_id)=>{
    const db = firebase.firestore().collection('nfts');
        metadata = {...metadata, "originalAuthor": walletAddress};

        var nft = {
            "id": token_id,
            "walletAddress": walletAddress,
            "address": collection,
            "artifactUri": metadata.artifactUri,
            "description": metadata.description,
            "title": metadata.name,
            "metadata": {...metadata, "displayUri": metadata.artifactUri},
            "date": new Date().toISOString(),
        };
        
        var docID =collection+'-'+token_id;
        await db.doc(walletAddress).collection('Creations').doc(docID).set(nft).then(function(docRef) {
            console.log('Document uploaded')//, docRef.id);
        }).catch((error)=>{
            console.log(error);
        });

    return null;

};

export default UploadNftToFireStore;