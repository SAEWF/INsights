// --this file used to Update Upload Nft details To FireStore  when minting of token success, imported in src\reducer\async\actions.ts--
import firebase from '../../../lib/firebase/firebase';
import * as uuid from "uuid";

const UploadNftToFireStore = async (walletAddress,collection,metadata,file)=>{
    const db = firebase.firestore().collection('nfts');
            var nft = {
                "id": uuid.v4(),
                "walletAddress": walletAddress,
                "address": collection,
                "artifactUri": metadata.artifactUri,
                "description": metadata.description,
                "title": metadata.attributes[0].value,
                "metadata": metadata,
                "fileName": file.name,
                "fileType": file.type
            };
            await db.doc(walletAddress).collection('NFTcollection').add(nft).then(function(docRef) {
                console.log('Document uploaded to Firestore')//, docRef.id);
            });

 return null;

};

export default UploadNftToFireStore;