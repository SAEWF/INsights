// --this file used to Update Art Token In Firebase when artists list nft for sell. imported in src\reducer\async\actions.ts--
import firebase from '../../lib/firebase/firebase';

const UpdateSoldnCollectedTokenInFB = async (buyerWallAdd,sellerWallAdd,tokenId)=>{
  //  var buyerWallAdd = "tz1LjLHwTthS3DU542igtZfqQCaiM7fz9C2C";
  //  var sellerWallAdd = "tz1PVw6WbK9pKjzLTxaWdHzXBskMiZLTaKuS";
  //  var tokenId = 133;

  //  console.log("UpdateSoldnCollectedTokenInFB")

    const ref = firebase.database().ref("data");
    var getKey=""
    // eslint-disable-next-line 
    const listener = ref
      .orderByChild("walletAddress")
      .equalTo(buyerWallAdd)
      .once('value', snapshot => {
          if (snapshot.val() === null) {
          console.log('id is not present in firebase buyerWallAdd');
          } 
          else {
        // console.log(snapshot.val());

              console.log('id is present in firebase buyerWallAdd');
              snapshot.forEach(childSnapshot => {
                  const key = childSnapshot.key;
                  console.log("key")
                  console.log(key);
                  getKey= key!==null?key:""
                  // const data = childSnapshot.val();
              })
           var dbQuery = ref.child(getKey+"/collectedTokens");
           // eslint-disable-next-line 
           var pushQuery = dbQuery.push(tokenId);
          removOneArtTokensValue(buyerWallAdd,tokenId)

          }
      });

    // eslint-disable-next-line 
        const listener1 = ref
      .orderByChild("walletAddress")
      .equalTo(sellerWallAdd)
      .once('value', snapshot => {
          if (snapshot.val() === null) {
          console.log('id is not present in firebase sellerWallAdd');
          } 
          else {
        // console.log(snapshot.val());

              console.log('id is present in firebase sellerWallAdd');
              snapshot.forEach(childSnapshot => {
                  const key = childSnapshot.key;
                  console.log("key")
                  console.log(key);
                  getKey= key!==null?key:""
                  // const data = childSnapshot.val();
              })
           var dbQuery = ref.child(getKey+"/soldTokens");
           // eslint-disable-next-line 
           var pushQuery = dbQuery.push(tokenId);
          removOneArtTokensValue(sellerWallAdd,tokenId)

          }
      });

    return null;
};

const removOneArtTokensValue = async (walletAddress,tokenId)=>{

      var artTokensFromDb
      var keyOfFoundToken =""

      const ref = firebase.database().ref("data");
      var getKey=""
      // eslint-disable-next-line 
      const listener = ref
        .orderByChild("walletAddress")
        .equalTo(walletAddress)
        .once('value', snapshot => {
            if (snapshot.val() === null) {
            console.log('id is not present in firebase removOneArtTokensValue');
            } 
            else {
                console.log('id is present in firebase removOneArtTokensValue');
                snapshot.forEach(childSnapshot => {
                    const key = childSnapshot.key;
                    const data = childSnapshot.val();
            // get key logic
                    console.log("key")
                    console.log(key);
                    getKey= key!==null?key:""
            // get data logic
                    console.log("artTokensFromDb")
                    artTokensFromDb = data.artTokens
                    console.log(artTokensFromDb);
  
                    const keys = Object.keys(artTokensFromDb);
                     keys.forEach((key, index) => {
                       if(artTokensFromDb[key]===tokenId ){
                          console.log('artTokensFromDb is not present in firebase');
                          keyOfFoundToken = key;
                       }
                       else{
                        console.log('artTokensFromDb is not present in firebase');
                      }
                        // console.log(`${key}: ${artTokensFromDb[key]}`);
                    });
                   
                })
                if(keyOfFoundToken!==""){
                  var dbQuery = ref.child(getKey+"/artTokens/"+keyOfFoundToken);
                  // eslint-disable-next-line 
                  var pushQuery = dbQuery.remove();
                }
            }
        });
}

export default UpdateSoldnCollectedTokenInFB;

// system.tzPublicKey actions.ts:540
// tz1LjLHwTthS3DU542igtZfqQCaiM7fz9C2C actions.ts:541
// tz1QBAh8mGg8CD28JritfHM7e7evaqKVyDcT actions.ts:542
// 76432399781 actions.ts:543
