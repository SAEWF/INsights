import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import './style.css';
import { Box, Text } from '@chakra-ui/react'; 
import firebase from '../../lib/firebase/firebase';
import { Container, Row, Col, Image, Card} from 'react-bootstrap';
import {Button, Flex, Heading, Spinner, Tabs, TabList, TabPanels, Tab, TabPanel 
} from '@chakra-ui/react'; //
import { useSelector } from '../../reducer';
import defaultBanner from '../common/assets/defaultBanner.jpg';
import TokenCard from '../Marketplace/Catalog/TokenCard';
import { FaEdit } from 'react-icons/fa';
import { useColorModeValue, Divider } from '@chakra-ui/react';

// getting artists from firestore
function FetchArtistData(usernameFromUrl: string) {
  const [tasks, setTasks] = useState<TasksType[]>([]);

  useEffect(() => {
    const db = firebase.firestore();
    var docRef = db.collection('artists');
    let temp: any[] = [];
    docRef.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        var username = doc.data().name;
        if(username===undefined) return;
        username = username.replaceAll(" ","");
        if(username===usernameFromUrl && doc.data().display!==undefined && doc.data().display){
          temp.push({id: doc.id, ...doc.data()});
        }
      });
      setTasks(temp);
    }, (error) => {
      console.log("Error getting documents: ", error);
    });
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
      let nfts: any[] = [], uniqueID: any[] = [];
      var docRef = db.collection('nfts').doc(walletID).collection('Creations').orderBy("id","desc");
      await docRef.get().then(async (querySnapshot) => {
        await querySnapshot.forEach((doc) => {
          // console.log(doc.id, " => ", doc.data());
          if(!uniqueID.includes(doc.data().address+'-'+doc.data().id)){
            nfts.push(doc.data());
          }
          uniqueID.push(doc.data().address+'-'+doc.data().id);
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
  }, [userdata]);

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
      let nfts: any[] = [], uniqueID: any[] = [];;
      var docRef = db.collection('nfts').doc(walletID).collection('Collections').orderBy("id","desc");
      await docRef.get().then(async (querySnapshot) => {
        await querySnapshot.forEach((doc) => {
          // console.log(doc.id, " => ", doc.data());
          if(!uniqueID.includes(doc.data().address+'-'+doc.data().id)){
            nfts.push(doc.data());
          }
          uniqueID.push(doc.data().address+'-'+doc.data().id);
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
  }, [userdata]);

  if(nft.length === 0){
    return [];
  }
  return nft;
}



export default function ArtistProfile(props: PropType) {

  // eslint-disable-next-line
  const bg = useColorModeValue('gray.100', 'black');
  const color = useColorModeValue('black', 'white');
  const { system } = useSelector(s => s);
  const [ , setLocation] = useLocation();
  const [walletAddress , setWalletAddress] = useState('');
  var usernameFromUrl: string = props.username
  // var userData = useItems(usernameFromUrl);
  var userDataFromFireStore = FetchArtistData(usernameFromUrl);

  const CreatedNFTs = GetNfts(userDataFromFireStore);
  const CollectedNFTs = GetCollectedNfts(userDataFromFireStore);

  useEffect(() => {
    if (system.status === 'WalletConnected') {
      const wallet = system.tzPublicKey;
      setWalletAddress(wallet);
    }
  }, [system.status, system.tzPublicKey]);

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

  if(userDataFromFireStore.length === 0){
    return(
      <Container className="main-container">
        <Flex flexDir="column" align="center" flex="1" pt={20}>
          <Spinner size="xl" mb={6} color="gray.300" />
          <Heading size="lg" textAlign="center" color="gray.500">
            No Artist Found
          </Heading>
        </Flex>
      </Container>
    )
  }
  else{
    return(
      <Container className="main-container">
        {userDataFromFireStore.map(item => (
          <>
              
            <div className="user-profile-block">
              <div className="user-profile-banner">
                <div className="user-profile-banner-wrapper">
                {item.banner!=="" && item.banner!==undefined 
                ?<Image alt="banner" className="user-profile-banner-img" src={item.banner}/> 
                :<Image alt="banner" className="user-profile-banner-img" src={defaultBanner}/>
                }
                </div>
                {
                  item.id=== walletAddress ? (
                  <Button mt={2} onClick={()=>{setLocation('/editprofile')}}>Edit Profile <FaEdit style={{'marginLeft':'10px'}}/></Button>
                  ) : (<></>)
                }
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

                  <Flex
                    position="relative"
                    flexDir="column"
                    ratio={1}

                    border="2px solid"
                    borderColor={color}
                    borderRadius="10px"
                    overflow="hidden"
                    boxShadow="none"
                    transition="all linear 50ms"
                    _hover={{
                      cursor: 'pointer',
                      boxShadow: '0px 0px 10px gray',
                    }}
                  >
                    <Box bg={bg} color={color} borderColor={color} md={6}>
                        {/* <Card border="light" className="text-left p-2 mt-2 mb-4" > */}
                          <Box bg={bg} color={color}>
                            <Card.Header className="font-weight-bold"><i className="far fa-compass"></i> Wallet Address </Card.Header>
                          </Box>
                          <Divider/>
                          <Box bg={bg} color={color}>
                            <Card.Body>
                              {/* <Card.Title>Light Card Title</Card.Title> */}
                              <Card.Text>
                                <Text>{item.walletAddress!=="" ?<>{item.walletAddress}</> :"No wallet address provided"}</Text>
                              </Card.Text>
                            </Card.Body>
                          </Box>
                        {/* </Card> */}
                      </Box>
                  </Flex>
                      
                  
                  <Flex
                    position="relative"
                    flexDir="column"
                    ratio={1}
                    border="2px solid"
                    borderColor={color}
                    borderRadius="10px"
                    overflow="hidden"
                    boxShadow="none"
                    transition="all linear 50ms"
                    _hover={{
                      cursor: 'pointer',
                      boxShadow: '0px 0px 10px gray',
                    }}

                    mt={6}
                  >
                    <Box bg={bg} color={color}>
                      {/* <Card border="light" className="text-left p-2 " > */}
                      <Box bg={bg} color={color}>
                        <Card.Header className="font-weight-bold"><i className="fas fa-link"></i> Social Media</Card.Header>
                      </Box>
                      <Divider borderColor={color}/>
                      <Box bg={bg} color={color} borderColor={color} >
                        <Card.Body className='text-center'>

                          <ul className="social-icons mt-2 mx-auto">
                              {(item.twt) !==""? <li><a className="twitter" href={getTwitterLink(item.twt)} target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter " ></i></a></li>:""}
                              {(item.fb) !==undefined && (item.fb) !==""? <li><a className="facebook" href={item.fb} target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook "></i></a></li>:""}
                              {(item.ig) !==""? <li><a className="" href={item.ig} target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram "  id="insta-color"></i></a></li>:""}
                              {(item.yt) !==""? <li><a className="youtube" href={item.yt} target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube " ></i></a></li>:""}
                              {(item.linktr) !=="" && item.linktr!==undefined? <li><a className="" href={item.linktr} target="_blank" rel="noopener noreferrer"><img className="fab fa-youtube p-1" src="https://img.icons8.com/color/452/linktree.png" alt=""></img></a></li>:""}
                              {(item.lt) !=="" && item.lt!==undefined? <li><a className="" href={item.lt} target="_blank" rel="noopener noreferrer"><img className="fab fa-youtube p-1" src="https://img.icons8.com/color/452/linktree.png" alt=""></img></a></li>:""}
                          </ul>
                        </Card.Body>
                      </Box>
                      {/* </Card> */}
                      
                    </Box>
                  </Flex>
                  </Col>
                  {/* sidebar */}

                  {/* column 2 start */}
                  <Col sm={12} md={9}>

                <Tabs size="lg" variant="line">
                  <TabList>
                    <Tab defaultIndex={1}>Creations ( {CreatedNFTs.length} )</Tab>
                    <Tab >Collections ( {CollectedNFTs.length} )</Tab>
                  </TabList>
                  <TabPanels>
                    {/* 3 TabPanel */}
                    <TabPanel>
                    {
                      (CreatedNFTs.length>0)
                      ? <>
                      <div>
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
                        </div>
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
      </Container>
    );
  }
}

interface PropType {
  username: string
}

interface TasksType {
  [index: string]: string
};