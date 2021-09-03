import React, { useState, useEffect } from 'react';
import './style.css';
import { Box, } from '@chakra-ui/react'; 
import firebase from '../../lib/firebase/firebase';
import { Container, Row, Col, Image, Card} from 'react-bootstrap';
import {Flex, Heading, Spinner, Tabs, TabList, TabPanels, Tab, TabPanel 
} from '@chakra-ui/react'; //
import { useSelector } from '../../reducer';
// import defaultAvatar from '../common/assets/defaultAvatar.jpg' ;
import defaultBanner from '../common/assets/defaultBanner.jpg';
// import ArtistProfileCard from './ArtistProfileCard';
import TokenCard from '../Marketplace/Catalog/TokenCard';

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

const GetNfts = (userdata: TasksType[]) =>{
  
  const [nft, setNft] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData(userdata: TasksType[]) {
      if(userdata.length === 0){
        return;
      }
      const walletID = userdata[0].walletAddress;
      if(walletID === undefined || walletID === ''){
        return;
      }
      const db = firebase.firestore();
      let nfts: any[] = [];
      var docRef = db.collection('nfts').doc(walletID).collection('Creations');
      await docRef.get().then(async (querySnapshot) => {
        await querySnapshot.forEach((doc) => {
          // console.log(doc.id, " => ", doc.data());
          nfts.push(doc.data());
        });
      }, (error) => {
        console.log("Error getting documents: ", error);
      });
      setNft(nfts);
      return () => {
        // console.log('unmount');
      }
    }
    fetchData(userdata);
  }, [userdata, nft, setNft]);

  if(nft.length === 0){
    return [];
  }
  return nft;
}

const GetCollectedNfts = (userdata: TasksType[]) =>{
  
  const [nft, setNft] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData(userdata: TasksType[]) {
      if(userdata.length === 0){
        return;
      }
      const walletID = userdata[0].walletAddress;
      if(walletID === undefined || walletID === ''){
        return;
      }
      const db = firebase.firestore();
      let nfts: any[] = [];
      var docRef = db.collection('nfts').doc(walletID).collection('Collections');
      await docRef.get().then(async (querySnapshot) => {
        await querySnapshot.forEach((doc) => {
          // console.log(doc.id, " => ", doc.data());
          nfts.push(doc.data());
        });
      }, (error) => {
        console.log("Error getting documents: ", error);
      });
      setNft(nfts);
      return () => {
        // console.log('unmount');
      }
    }
    fetchData(userdata);
  }, [userdata, nft, setNft]);

  if(nft.length === 0){
    return [];
  }
  return nft;
}



export default function ArtistProfile(props: PropType) {

  const { system, marketplace: state } = useSelector(s => s);

  var usernameFromUrl: string = props.username
  const userData = useItems(usernameFromUrl);
  const CreatedNFTs = GetNfts(userData);
  const CollectedNFTs = GetCollectedNfts(userData);

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
          {/* {console.log("item")}
              {console.log(item)} */}
              
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

                <Tabs size="lg" variant="line">
                  <TabList>
                    <Tab defaultIndex={1}>Creations</Tab>
                    <Tab >Collections</Tab>
                  </TabList>
                  <TabPanels>
                    {/* 3 TabPanel */}
                    <TabPanel>
                    {
                      (CreatedNFTs.length>0)
                      ? <>
                      <Container>
                          <Row xs={1} md={2} lg={3} xl={3}>
                            {
                              CreatedNFTs.map((token)=>{
                                return (
                                  <Col >
                                    <Box display="grid" transition="250ms padding" padding={1} _hover={{ padding: 0 }} mb={7}>
                                    <TokenCard
                                      key={`${token.address}-${token.id}`}
                                      config={system.config}
                                      {...token}
                                    />
                                  </Box>
                                </Col>
                                );
                              })
                            }
                          </Row>
                        </Container>
                      </>
                      :
                      <h2>No Created NFT to display by this artist</h2>
                    }
                    
                    </TabPanel>
                    <TabPanel>
                    {(CollectedNFTs.length>0)
                    ? <>
                        <Container>
                          <Row xs={1} md={2} lg={3} xl={3}>
                            {
                              CollectedNFTs.map((token)=>{
                                return (
                                  <Col >
                                    <Box display="grid" transition="250ms padding" padding={1} _hover={{ padding: 0 }} mb={7}>
                                    <TokenCard
                                      key={`${token.address}-${token.id}`}
                                      config={system.config}
                                      {...token}
                                    />
                                  </Box>
                                </Col>
                                );
                              })
                            }
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