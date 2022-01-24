import React, { useState, useEffect } from 'react';
import { Container, Row, Col, } from 'react-bootstrap';
import './style.css';
import firebase from '../../lib/firebase/firebase';
import { useLocation } from 'wouter';
import {Flex} from '@chakra-ui/react';

// getting artlist from firestore
const GetArtists = () =>{
  const [artist, setArtist] = useState<Task[]>([]);

  useEffect(() => {
    async function fetchData() {
      const db = firebase.firestore();
      var docRef = db.collection('artists');
      let temp: any[] = [];
      await docRef.get().then(async (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // console.log(doc.id, " => ", doc.data());

          if(doc.data().display!==undefined && doc.data().display)
          temp.push({id: doc.id, ...doc.data()});
        });
        setArtist(temp);
      }, (error) => {
        console.log("Error getting documents: ", error);
      });
    }
    fetchData();
  }, []);
  return artist;
}

export default function ArtistList() {
  const artists = GetArtists();
  const [, setLocation] = useLocation();

  const getTwitterLink = (twitter: string) => {
    if(twitter === undefined || twitter === ''){
      return '';
    }
    if(twitter.includes('https://twitter.com/')){
      return twitter;
    }
    if(twitter.includes('@')){
      return 'https://twitter.com/'+twitter.replace('@','');
    }
    return 'https://twitter.com/'+twitter;
  }

  return (
    <Flex
        w="100vw"
        h="100%"
        px={10}
        pt={6}
        overflowY="scroll"
        justify="start"
        flexDir="row"
      >
    <Container>
    
<div className="one mt-4 mb-3">
  <h1>Our Artists</h1>
</div>

      <Row xs={1} md={2} lg={3} xl={3} >
        {
          artists.length>0?
          artists.map(item => (

            <Col>
              <div className="card profile-card-1 mb-5"
              >
                <img  alt="background" src="https://images.pexels.com/photos/946351/pexels-photo-946351.jpeg?w=500&h=650&auto=compress&cs=tinysrgb" className="background" 
                  onClick={
                    () => setLocation(`/artistprofile/${item.name.replaceAll(" ","")}`)
                }/>
                <img alt="avatar" src={item.avatar} className="profile" />
                <div className="card-content" >
                  <h2 onClick={
                  () => setLocation(`/artistprofile/${item.name.replaceAll(" ","")}`)
                }>
                    {item.name}
                  </h2>
                  <ul className="mt-2" style={{justifyContent: 'center', display:'flex', zIndex: 1}} 
                    onClick={
                      () => setLocation(`/artists`)
                  }>
                    {(item.twt) !==""? <a className="twitter" href={getTwitterLink(item.twt)} target="_blank" id="twt" rel="noopener noreferrer" style={{color:'red'}}><i className="fab fa-twitter " ></i></a>:""}
                    {(item.fb) !==undefined && (item.fb) !==""? <a className="facebook" href={item.fb} target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook "></i></a>:""}
                    {(item.ig) !==""? <a className="" href={item.ig} target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram "  id="insta-color"></i></a>:""}
                    {(item.yt) !==""? <a className="youtube" href={item.yt} target="_blank" rel="noopener noreferrer" id="yt"><i className="fab fa-youtube " ></i></a>:""}
                    {(item.lt) !=="" && item.lt!==undefined? <a className="" href={item.lt} target="_blank" rel="noopener noreferrer"><img id="lt" src="https://img.icons8.com/color/452/linktree.png" alt=""></img></a>:""}
                  </ul>
                </div>
              </div>
            </Col>
          ))
          :<></>
        }

      </Row >
    </Container >
    </Flex>
  );

}

interface Task {
  [index: string]: string
};