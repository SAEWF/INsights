import * as uuid from "uuid";
import firebase from '../../lib/firebase/firebase'; 

const uploadImage = async (file) => {
    try{
        var storageRef = firebase.storage().ref();
        var uploadTask = await storageRef.child('images/' + uuid.v4()).put(file);

        const downloadURL = await uploadTask.ref.getDownloadURL();
        return downloadURL;
    }catch(error){
        console.log(error);
    }
}

    export default uploadImage;