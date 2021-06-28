import React, { useState, useEffect,useRef } from 'react';
import firebase from '../../lib/firebase/firebase';

const useItems = (walletAddress: string) => {
    const [tasks, setTasks] = useState<TasksType[]>([]);
  
    useEffect(() => {
      const ref = firebase
        .database()
        .ref("data");
      const listener = ref
        .orderByChild("walletAddress")
        .equalTo(walletAddress)
        .once('value', snapshot => {
          const fetchedTasks: any[] = [];
          snapshot.forEach(childSnapshot => {
            const key = childSnapshot.key;
            const data = childSnapshot.val();
            fetchedTasks.push({ id: key, ...data });
          });
          setTasks(fetchedTasks);
        });
      // return () => ref.off('value', listener);
    }, [walletAddress]);
    return tasks;
  }

export default function Temp() {
    const userData = useItems("tz1LjLHwTthS3DU542igtZfqQCaiM7fz9C2C"); //array of obj
     var artTokensFromDb: string[] = [];

        userData.map(item => {
            var oldTokens = item.artTokens;
            for(var i of oldTokens){
              artTokensFromDb.push(i) //array only
            }
          })

    // console.log("userData")
    // console.log(userData);
 
  var oneNewToken = "100";

  console.log("artTokensFromDb")
  console.log(artTokensFromDb);
  artTokensFromDb.push(oneNewToken)
  console.log(artTokensFromDb);

    var db = firebase.database();
    var query = db.ref("data").orderByChild("walletAddress").equalTo("tz1LjLHwTthS3DU542igtZfqQCaiM7fz9C2C");
    query.once("child_added", (snapshot) =>{
       //updating artTokens in db
      snapshot.ref.update({ artTokens: artTokensFromDb })
    });


  
  return (
        <h1>temp</h1>
  );

}


interface TasksType {
  [index: string]: string
};