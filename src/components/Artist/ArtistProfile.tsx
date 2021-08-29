import React, { useState, useEffect } from 'react';
import './style.css';
import firebase from '../../lib/firebase/firebase';
import { Container, Row, Col, Image, Card} from 'react-bootstrap';
import {Flex, Heading, Spinner, Tabs, TabList, TabPanels, Tab, TabPanel 
} from '@chakra-ui/react'; //
// import defaultAvatar from '../common/assets/defaultAvatar.jpg' ;
import defaultBanner from '../common/assets/defaultBanner.jpg';
import ArtistProfileCard from './ArtistProfileCard';
import ArtistNftProfileCard from './ArtistNftProfileCard';

const useItems = (usernameFromUrl: string) => {
  const [tasks, setTasks] = useState<TasksType[]>([]);
  
  useEffect(() => {
    const ref = firebase
      .database()
      .ref("data");
    const listener = ref
      .orderByChild("username")
      .equalTo(usernameFromUrl)
      .on('value', snapshot => {
        const fetchedTasks: any[] = [];
        // if (snapshot.val() === null) { 
        //   console.log('id is not present in firebase');
        // } else {
        //   console.log('id is present in firebase');
        // }
        snapshot.forEach(childSnapshot => {
          const key = childSnapshot.key;
          const data = childSnapshot.val();
          fetchedTasks.push({ id: key, ...data });
        });
        setTasks(fetchedTasks);
      });
    return () => ref.off('value', listener);
  }, [usernameFromUrl]);
  return tasks;
}

const getNfts = async (walletID: string) =>{
  console.log('walletID', walletID);
  const db = firebase.firestore();
  let nfts: any[] = [];
  var docRef = db.collection('nfts').doc(walletID).collection('NFTcollection');
  await docRef.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      nfts.push(doc.data());
    });
  });

  return nfts;

  // if(nfts){
  //   console.log('nfts', nfts);
  // }
}
  
  // const listener = ref.child(walletID).on('value', snapshot => {
  //   const fetchedTasks: any[] = [];
  //   snapshot.forEach(childSnapshot => {
  //     const key = childSnapshot.key;
  //     const data = childSnapshot.val();
  //     fetchedTasks.push({ id: key, ...data });
  //   });
  //   return fetchedTasks;
  // });
  // return listener;
// }


export default function ArtistProfile(props: PropType) {
  var usernameFromUrl: string = props.username
  const userData = useItems(usernameFromUrl);
  // console.log("userData")
  // const [walletID, setWalletID] = useState<string>("");
  // console.log("USERDATA",userData);

  if(userData.length !== 0){
    // setWalletID(userData[0].walletAddress);
    console.log('userData', userData);
    const nft = getNfts(userData[0].walletAddress);
    console.log("nft", nft);
  }

  // console.log("nfts", nfts);
  return (
    <Container className="main-container">

      {(userData.length === 0)
        ?<Flex flexDir="column" align="center" flex="1" pt={20}>
          <Spinner size="xl" mb={6} color="gray.300" />
          <Heading size="lg" textAlign="center" color="gray.500">
            Loading...
          </Heading>
        </Flex>
        : userData.map(item => (
          <>
          {/* {console.log("item.artTokens")}
              {console.log(item.artTokens)} */}
              
            <div className="user-profile-block">
              <div className="user-profile-banner">
                <div className="user-profile-banner-wrapper">
                {item.banner!=="" 
                ?<Image alt="banner" className="user-profile-banner-img" src={item.banner}/> 
                :<Image alt="banner" className="user-profile-banner-img" src={defaultBanner}/>
                }
                </div>

                <div className="user-profile-avatar-wrapper mx-auto">
                  <Image alt="Avatar" className="user-profile-img"  src={item.avatar} thumbnail  />       
                </div>
                <div className="user-profile-name-div text-center mx-auto">
                    <h2 className="user-profile-name font-weight-bold ">{item.name}</h2>
                  </div>
                  <div className="text-center m-2 mx-auto">
                    {item.description!=="" 
                      ?<p className="para-text-mute">{item.description}</p>
                      :""}
                  </div>

                <Row className="my-5">
                  {/* sidebar */}
                  <Col sm={12} md={3}>
                      {/* <h2 className="user-profile-name font-weight-bold mb-2 pl-1">{item.name}</h2> */}

                      {/* <Card border="light" className="text-left p-2" >
                        <Card.Header className="font-weight-bold"><i className="far fa-user"></i> Username</Card.Header>
                        <Card.Body>
                          <Card.Text>
                            {item.username}
                          </Card.Text>
                        </Card.Body>
                      </Card> */}

                      {/* <Card border="light" className="text-left p-2" >
                        <Card.Header className="font-weight-bold"><i className="far fa-envelope"></i> E-mail </Card.Header>
                        <Card.Body>
                          <Card.Text>
                                {item.email!=="" ?<>{item.email}</> :"No e-mail provided"}
                          </Card.Text>
                        </Card.Body>
                      </Card> */}

                      <Card border="light" className="text-left p-2 mt-2 mb-4" >
                        <Card.Header className="font-weight-bold"><i className="far fa-compass"></i> Wallet Address </Card.Header>
                        <Card.Body>
                          {/* <Card.Title>Light Card Title</Card.Title> */}
                          <Card.Text>
                            {item.walletAddress!=="" ?<>{item.walletAddress}</> :"No wallet address provided"}
                          </Card.Text>
                        </Card.Body>
                      </Card>

                      <Card border="light" className="text-left p-2 " >
                        <Card.Header className="font-weight-bold"><i className="fas fa-link"></i> Social Media</Card.Header>
                        <Card.Body>
                          {/* <Card.Title>Light Card Title</Card.Title> */}
                          {/* <Card.Text>
                             tz1LjLHwTthS3DU542igtZfqQCaiM7fz9C2C
                          </Card.Text> text-center*/}

                        <ul className="social-icons mt-2">
                            {(item.twt) !==""? <li><a className="twitter" href={item.twt} target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter " ></i></a></li>:""}
                            {(item.fb) !==""? <li><a className="facebook" href={item.fb} target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook "></i></a></li>:""}
                            {(item.ig) !==""? <li><a className="" href={item.ig} target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram "  id="insta-color"></i></a></li>:""}
                            {(item.yt) !==""? <li><a className="youtube" href={item.yt} target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube " ></i></a></li>:""}
                            {(item.linktr) !==""? <li><a className="" href={item.linktr} target="_blank" rel="noopener noreferrer"><img className="fab fa-youtube p-1" src="https://img.icons8.com/color/452/linktree.png" alt=""></img></a></li>:""}
                          </ul>
                        </Card.Body>
                      </Card>
                  </Col>
                  {/* sidebar */}

                  {/* column 2 start */}
                  <Col sm={12} md={9}>
                    {/* <div className="three mb-3">
                      <h1>Originally Created</h1>
                    </div>
                    {(item.artTokens !== undefined)
                    ? <ArtistProfileCard artTokens={item.artTokens}/>
                    :<h2>No NFT to display by this artist</h2>} */}

                <Tabs size="lg" variant="line">
                  <TabList>
                    <Tab defaultIndex={1}>NFTs</Tab>
                    <Tab >Sold NFTs</Tab>
                    <Tab >Collected NFTs</Tab>
                  </TabList>
                  <TabPanels>
                    {/* 3 TabPanel */}
                    <TabPanel>
                    {(item.artTokens !== undefined || item.artTokensWithAddr !== undefined)
                    ? <>
                     <Container>
                        <Row xs={1} md={2} lg={3} xl={3}>
                          {(item.artTokens !== undefined) ? <ArtistProfileCard artTokens={item.artTokens}/>:""}
                          {(item.artTokensWithAddr !== undefined)? <ArtistNftProfileCard artTokensWithAddr={item.artTokensWithAddr}/> :""}
                        </Row>
                      </Container>
                    </>
                    :<h2>No NFT to display by this artist</h2>}
                    </TabPanel>
                    <TabPanel>
                    {(item.soldTokens !== undefined)
                    ? <>
                        <Container>
                          <Row xs={1} md={2} lg={3} xl={3}>
                            <ArtistProfileCard artTokens={item.soldTokens}/>
                          </Row>
                        </Container>
                      </>
                    :<h2>No Sold NFT to display by this artist</h2>}
                    </TabPanel>
                    <TabPanel>
                    {(item.collectedTokens !== undefined)
                    ? <>
                        <Container>
                          <Row xs={1} md={2} lg={3} xl={3}>
                              <ArtistProfileCard artTokens={item.collectedTokens}/>
                          </Row>
                        </Container>
                      </>
                    :<h2>No Collected NFT to display by this artist</h2>}
                    </TabPanel>
                   
                  </TabPanels>
                </Tabs>

                  </Col>
                  {/* column 2 end */}

                </Row>

              </div>
            </div>
          </>
        ))}

    </Container >
  );

}

interface PropType {
  username: string
}

interface TasksType {
  [index: string]: string
};