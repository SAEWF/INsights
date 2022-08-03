import React, { useState, useEffect } from 'react';
import { Row, Col, } from 'react-bootstrap';
import './style.css';
import firebase from '../../lib/firebase/firebase';
import { useLocation } from 'wouter';
import {Input, Box} from '@chakra-ui/react';

// getting artlist from firestore
const GetArtists = async () =>{
  let artist:any = [];
  const db = firebase.firestore();
  var docRef = db.collection('artists');
  let temp:any = [];
  await docRef.get().then(async (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      // console.log(doc.id, " => ", doc.data());

      if(doc.data().display!==undefined && doc.data().display)
      temp.push({id: doc.id, ...doc.data()});
    });
    artist = temp;
  }, (error) => {
    console.log("Error getting documents: ", error);
  });
  return artist;
}

export default function ArtistList() {
  const [artists, setArtists] = useState<any>([]);
  const [allArtists, setAllArtists] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();

  useEffect(() => {
    // const fetchData = async() => {
      // let artists_ = await GetArtists().
      GetArtists().then(async (artists_:any) => {
      setArtists([...artists_]);
      setAllArtists([...artists_]);
    });
    // fetchData();
  }, []);
  
  useEffect(() => {
    if(searchQuery === ''){
      setArtists([...allArtists]);
    }else{
      
      console.log("searching for: ", searchQuery);
      let temp = allArtists.filter((artist:any) => {
        let searchQuery_ = searchQuery.toLowerCase();
        return ( (artist.country !== undefined) && artist.country.toLowerCase().includes(searchQuery_)  )
            || ( (artist.description !== undefined) && artist.description.toLowerCase().includes(searchQuery_) )
            || ( (artist.email !== undefined) && artist.email.toLowerCase().includes(searchQuery_) )
            || ( (artist.ig !== undefined) && artist.ig.toLowerCase().includes(searchQuery_) )
            || ( (artist.lt !== undefined) && artist.lt.toLowerCase().includes(searchQuery_) )
            || ( (artist.name !== undefined) && artist.name.toLowerCase().includes(searchQuery_) )
            || ( (artist.twt !== undefined) && artist.twt.toLowerCase().includes(searchQuery_) )
            || ( (artist.yt !== undefined) && artist.yt.toLowerCase().includes(searchQuery_) )
            || ( (artist.id !== undefined) && artist.id.toLowerCase().includes(searchQuery_))
            || ( (artist.walletAddress !== undefined) && artist.walletAddress === searchQuery_);
      });

      console.log(temp);
      setArtists([...temp]);
    }
  // eslint-disable-next-line
  }, [searchQuery]);
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
    // <Flex
    //     // w="100vw"
    //     h="100%"
    //     px={10}
    //     pt={6}
    //     overflowY="scroll"
    //     justify="start"
    //     flexDir="row"
    //   >
    // <Container w="100%"> 
    <Box mx={5} my={1} h="100vw">
    <div>
    
      <div className="one mt-4 mb-3">
        <h1>Our Artists</h1>
      </div>

      <Row xs={1} md={1} lg={1} xl={1} className="px-3" >
        <Input 
          placeholder='Search artists here...' 
          size='md'
          mb={4}
          value={searchQuery}
          onChange={(e:any) => { setSearchQuery(e.target.value);  } }
        />
      </Row>

      <Row xs={1} md={2} lg={3} xl={3} style={{"width":"100%"}}>
        {
          artists.length>0?
          artists.map( (item:any) => (

            <Col key={item.id}>
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
      </div>
    </Box>
    // </Container >
    // {/* </Flex> */}
  );

}