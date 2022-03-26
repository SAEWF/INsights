import React, { useState } from 'react';
import { Token } from '../../../reducer/slices/collections';
import { IpfsGatewayConfig } from '../../../lib/util/ipfs';
import { AspectRatio, Box, Flex } from '@chakra-ui/react';
import { TokenMedia } from '../../common/TokenMedia';
// import tz from '../../common/assets/tezos-sym-white.svg'
import { Card } from 'react-bootstrap';
import Countdown from 'react-countdown';
import { notifyFulfilled } from '../../../reducer/slices/notificationsActions';
import { useDispatch } from 'react-redux';
import firebase from '../../../lib/firebase/firebase';
import { useColorModeValue, Image, Text} from '@chakra-ui/react';
import user_icon from '../assets/user_icon.png';
import Timer from './Timer'

interface TokenCardProps extends Token {
  config: IpfsGatewayConfig;
  metadata: any;
}


export default function TokenCard(props: any) {
  const bg = useColorModeValue('gray.100', 'black');
  const color = useColorModeValue('black', 'white');
  const [owner, setOwner] = React.useState('');
  const [artistImg, setArtistImg] = React.useState(user_icon);
  const timer = useState('00:00:00');
  const dispatch = useDispatch();
  //console.log("Props => ", props);

  
  React.useEffect(() => {
    var own : any;
    if(props.sale!==undefined && props.sale!==null) {
      own = props.sale.seller;
    } else if(props.metadata!==undefined && props.metadata!==null) {
      own = props.metadata.minter;
    } else {
      own = props.owner;
    }
    
    const db = firebase.firestore();
    const docRef = db.collection('artists').doc(own);
    docRef.get().then(function(doc) {
      if (doc.exists) {
        var data = doc.data()!;
        if(data && data.display){
          setArtistImg(data.avatar);
          setOwner(data.name);
        }
        else{
          setOwner(own);
        }
      } else {
        setOwner(own);
        // console.log("No such document!", own);
      }
    }).catch(function(error) {
      console.log("Error getting document:", error);
    });
  }, [props]);


  const openInNewTab = (url: string) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`https://byteblock.art/collection/${props.address}/token/${props.id}`);
    dispatch(notifyFulfilled('1', 'Link copied to clipboard'));
  }


  let royalty: any, royaltyArray , royaltyAmount, royaltyPercentage, totalAmount: any, creatorAddress, ownerAddress;;
  
  if(props.sale){
    if(props.metadata.royalties!==undefined){
      const shares = props.metadata.royalties.shares;
      const decimal = props.metadata.royalties.decimals;
      for(var walletID in shares){
        royalty = shares[walletID];
      }
      if(props.metadata.creators[0]==="KraznikDAO")
        royaltyPercentage = 3;
      else if(props.metadata.creators[0]==="deconcept.tez")
        royaltyPercentage = 5;
      else 
        royaltyPercentage = royalty*Math.pow(10,-decimal+2);

      royaltyAmount = royalty*Math.pow(10,-decimal)*props.sale.price;
      creatorAddress = Object.keys(props.metadata?.royalties.shares)[0];
      ownerAddress = props.sale.seller;

      if(creatorAddress===ownerAddress){
        totalAmount = props.sale.price;
      }
      else{
        totalAmount = props.sale.price + royaltyAmount;
      }
    }
    else if(props.metadata.symbol && props.metadata.symbol==='OBJKT'){
      royaltyPercentage = 0.1;
      royaltyAmount = props.sale.price*royaltyPercentage;
      creatorAddress = props.metadata.creators[0];
      ownerAddress = props.sale.seller;
      if(creatorAddress===ownerAddress){
        totalAmount = props.sale.price;
      }
      else{
        totalAmount = props.sale.price + royaltyAmount;
      }
    }
    else if(props.metadata?.creatorRoyalty!==undefined){
      creatorAddress = props.metadata.creators[0];
      royaltyPercentage = props.metadata?.creatorRoyalty;
      royaltyAmount = props.sale.price*royaltyPercentage;
      ownerAddress = props.sale.seller;
      if(creatorAddress===ownerAddress){
        totalAmount = props.sale.price;
      }
      else{
        totalAmount = props.sale.price + royaltyAmount;
      }
    }
    else{
      royalty = props.metadata!.attributes?.filter((it: any) => it.name==='Royalty');
      royaltyArray = props.metadata!.attributes?.filter((it: any) => it.name==='Royalty');
      royaltyPercentage = (royaltyArray!==undefined && royaltyArray!.length > 0) ? parseInt(royaltyArray[0].value) : 10;
      royaltyAmount = (props.sale !== undefined && props.sale.seller!==props.metadata.minter) ?  royaltyPercentage*props.sale!.price / 100.0 : 0;
      creatorAddress = props.metadata.minter;
      ownerAddress = props.sale.seller;
      if(creatorAddress===ownerAddress){
        totalAmount = props.sale.price;
      }
      else{
        totalAmount = props.sale.price + royaltyAmount;
      }
    }
  }
  else{
    if(props.metadata?.royalties!==undefined){
      const shares = props.metadata.royalties.shares;
      const decimal = props.metadata.royalties.decimals;
      for(var wallet in shares){
        creatorAddress = wallet;
        royalty = shares[wallet];
      }
      if(props.metadata.creators[0]==="KraznikDAO")
        royaltyPercentage = 3;
      else if(props.metadata.creators[0]==="deconcept.tez")
        royaltyPercentage = 5;
      else 
        royaltyPercentage = royalty*Math.pow(10,-decimal+2);
    }
    else if(props.metadata?.symbol && props.metadata.symbol==="OBJKT"){
      royaltyPercentage = 10;
      creatorAddress = props.metadata.creators[0];
    }
    else if(props.metadata?.creatorRoyalty!==undefined){
      creatorAddress = props.metadata.creators[0];
      royaltyPercentage = props.metadata?.creatorRoyalty;
    }
    else if(props.metadata){
      creatorAddress = props.metadata.minter;
      royalty = props.metadata!.attributes?.filter((it: any) => it.name==='Royalty');
      royaltyArray = props.metadata!.attributes?.filter((it: any) => it.name==='Royalty');
      royaltyPercentage = (royaltyArray!==undefined && royaltyArray!.length > 0) ? parseInt(royaltyArray[0].value) : 10;
    }
  }

  totalAmount = props.auction.current_bid/1000000.0;
  const time = new Date(props.auction.end_time);
  // const time = new Date(props.auction.end_time).getTime();
  //  console.log("time - ", time);
  //  console.log("time epochs - ", time.getTime());
  //  console.log("time2 - ", props.auction.end_time);

  return (
    <Flex
      position="relative"
      flexDir="column"
      ratio={1}
      w="90%"
      // bg="white"
      border="1px solid"
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
      {/* {
        props.metadata && props.metadata?.symbol && props.metadata.symbol==="OBJKTCOM" ?
        <Box bg={bg} color={color}><Card.Header>Objkt.com</Card.Header></Box>
        :
        props.metadata && props.metadata.creators && props.metadata.creators[0]==="KraznikDAO" ?
        <Box bg={bg} color={color}><Card.Header>KraznikDAO</Card.Header></Box>
        :
        props.metadata && props.metadata.creators && props.metadata.creators[0]==="@Portferio and @NFT_Head" ?
        <Box bg={bg} color={color}><Card.Header>TezFingers</Card.Header></Box>
        :
        props.metadata && props.metadata.creators && props.metadata.creators[0]==="deconcept.tez" ?
        <Box bg={bg} color={color}><Card.Header>Hash Three Points</Card.Header></Box>
        :
        props.address==="KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton" ?
        <Box bg={bg} color={color}><Card.Header>Hic et Nunc</Card.Header></Box>
        :
        props.address==="KT1EpGgjQs73QfFJs9z7m1Mxm5MTnpC2tqse" ?
        <Box bg={bg} color={color}><Card.Header>Kalamint</Card.Header></Box>
        :
        <Box bg={bg} color={color}><Card.Header>ByteBlock</Card.Header></Box>
      } */}
      <Box bg={bg} color={color}><Card.Header>Ends in: <Timer expiryTimestamp = {time} /></Card.Header></Box>
      
      
      <AspectRatio ratio={3 / 3.5}       
        onClick={() =>
        openInNewTab(`/collection/${props.address}/token/${props.id}`)
      }>
        <Box>
          <TokenMedia {...props} />
          {/* <Image src='https://tqtezos.mypinata.cloud/ipfs/QmYM5pi7D1DpJkABV6aHpw4rQz4Te4doUxdN7wcbLMeAUW' thumbnail /> */}
        </Box>
      </AspectRatio>
      {/* <Flex
        width="100%"
        px={4}
        py={4}
        bg="white"
        borderTop="1px solid"
        borderColor="brand.lightBlue"
        flexDir="row"
        justifyContent="space-between"
      >
        <Flex display="block" fontSize="md" width="70%" alignItems="center" height="100%" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">{props.title}</Flex>
        <Flex fontSize="md" fontWeight="600" width="30%" justifyContent="flex-end" alignItems="center">
          {props.sale?.price} <img src={tz} alt="" width={10} height="auto" style={{ display: 'inline-block' }} />
        </Flex>
      </Flex> */}
      <Card.Body className="ml-2"       
        onClick={() =>
        openInNewTab(`https://byteblock.art/collection/${props.address}/token/${props.id}`)
      }>
        <Card.Title className="ml-1" >{props.title}</Card.Title>
        {/* <Card.Text>
                This is a wider card with supporting text below as a natural lead-in to
                additional content. This content is a little bit longer.
            </Card.Text> */}
        <Box>
          {/* <Image borderRadius={"100%"} src={artistImg} alt="artist" width={10} height={10} />  */}
          { owner==='' ?
             (<Flex><i className="fas fa-user mr-2" style={{
              display: "inline-block",
              borderRadius: "60px",
              boxShadow: "0px 0px 2px #888",
              padding: "0.5em 0.6em",
            }}></i> <Text fontWeight='bold' bgGradient='linear(to-r, pink.500, pink.300, blue.500)' bgClip='text'>Anonymous</Text> </Flex>)
            :(<Flex>
              <Image borderRadius='full' w={8} h={8} mr={2} bg='gray.300' src={artistImg} alt=" " /> <Text fontWeight='bold' bgGradient='linear(to-r, pink.500, pink.300, blue.500)' bgClip='text'>{owner}</Text>
             </Flex>)
          }
          
        {/*  */}
          
        </Box>
      </Card.Body>
      {/* background-color: cyan; position: relative; left: 22px; top: 0px; display: flex; justify-content: flex-end; align-items: flex-start; */}
      <Box bg={bg} color={color}>
        <Card.Footer className="text-white" style={{ display: 'flex' }}>
          <Flex        
            onClick={() =>
            openInNewTab(`https://byteblock.art/collection/${props.address}/token/${props.id}`)
          }>
          <p className="text-muted d-inline mr-2">Current Bid :</p>
          <p className="d-inline"> <Text color={color}>{totalAmount>0?totalAmount.toFixed(2):'Not on sale'} ꜩ</Text>
            
          </p>
          </Flex>
          <div style={{marginLeft: 'auto', marginRight: '0'}}>
            <button 
              style={{color: 'black',borderRadius: '3px', backgroundColor: '#00ffbe',padding: '3px' ,position: 'relative', justifyContent: 'flex-end',alignItems: 'flex-end'}}
              onClick={() => copyToClipboard()}  
            >
              <i className="fas fa-share-alt ml-1"></i>
            </button>
          </div>
        </Card.Footer>
      </Box>
      
    </Flex>
  );
}