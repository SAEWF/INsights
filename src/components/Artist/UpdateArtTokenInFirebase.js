// --this file used to Update Art Token In Firebase when artists list nft for sell. imported in src\reducer\async\actions.ts--
import firebase from '../../lib/firebase/firebase';

const UpdateArtTokenInFirebase = async (wallAdd,token_id)=>{
 // wallAdd = wallet Address
//  var newTokenId = token_id.toString();
 var newTokenId = token_id;

//  console.log("UpdateArtTokenInFirebase")
//  console.log(wallAdd);
//  console.log(newTokenId);

  //  var oneNewToken = "104";
  const ref = firebase.database().ref("data");
  var getKey=""


  const listener = ref
        .orderByChild("walletAddress")
        .equalTo(wallAdd)
        .once('value', snapshot => {
            if (snapshot.val() === null) {
            console.log('id is not present in firebase');

            } 
            else {
          // console.log(snapshot.val());

                console.log('id is present in firebase');
                snapshot.forEach(childSnapshot => {
                    const key = childSnapshot.key;
                    // console.log("key")
                    // console.log(key);
                    getKey= key!==null?key:""
                    const data = childSnapshot.val();
                })
             var dbQuery = ref.child(getKey+"/artTokens");
             var pushQuery = dbQuery.push(newTokenId);
            }
        });


    return null;

};

export default UpdateArtTokenInFirebase;

