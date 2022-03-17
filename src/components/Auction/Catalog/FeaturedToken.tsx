import React from 'react';
import { Token } from '../../../reducer/slices/collections';
// import { useLocation } from 'wouter';
import { IpfsGatewayConfig } from '../../../lib/util/ipfs';
import {
  Flex,
  Image,
  Text,
  Heading,
} from '@chakra-ui/react';
import { notifyFulfilled } from '../../../reducer/slices/notificationsActions';
import { useDispatch } from 'react-redux';
import { MinterButton } from '../../common';
import { TokenMedia } from '../../common/TokenMedia';
// import tz from '../../common/assets/tezos-sym-white.svg';
import { Container, Row, Col } from 'react-bootstrap';
import firebase from '../../../lib/firebase/firebase';
import user_icon from '../assets/user_icon.png';

interface FeaturedTokenProps extends Token {
  config: IpfsGatewayConfig;
  metadata: any;
}

export default function FeaturedToken(props: FeaturedTokenProps) {
  // const [, setLocation] = useLocation();
  const [owner, setOwner] = React.useState('');
  const [artistImg, setArtistImg] = React.useState(user_icon);
  const dispatch = useDispatch();

  React.useEffect(() => {
    var own : any;
    if(props.sale!==undefined && props.sale!==null) {
      own = props.sale.seller;
    } else if(props.metadata.minter!==undefined && props.metadata.minter!==null) {
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
        // console.log("Document data:", data);
      } else {
        setOwner(own);
        // console.log("No such document!", own);
      }
    }).catch(function(error) {
      console.log("Error getting document:", error);
    });
  }, [props]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`https://byteblock.art/collection/${props.address}/token/${props.id}`);
    dispatch(notifyFulfilled('1', 'Link copied to clipboard'));
  }
  
  const openInNewTab = (url: string) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
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
      royaltyPercentage = props.metadata?.creatorRoyalty;
    }
    else{
      creatorAddress = props.metadata.minter;
      royalty = props.metadata!.attributes?.filter((it: any) => it.name==='Royalty');
      royaltyArray = props.metadata!.attributes?.filter((it: any) => it.name==='Royalty');
      royaltyPercentage = (royaltyArray!==undefined && royaltyArray!.length > 0) ? parseInt(royaltyArray[0].value) : 10;
    }
  }

  return (
    <>
      <Container fluid className="mb-5">
        <Row >
          {/* Column 1 */}
          <Col xs={12} md={12} lg={9} xl={9} className="text-center" style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <div className="my-auto"
            //  style={{ maxHeight: "85vh" }}
            >
              {/* <Flex maxHeight={['45vh', '85vh']} marginRight={[0, 8]} justifyContent="center"
              width={['85vw', '65vw', '45vw']}
             >  */}
              <TokenMedia
                objectFit="contain"
                maxW="100%"
                maxH="70vh"
                class="featured"
                {...props}
              />
              {/* </Flex> */}
            </div>
          </Col>
          {/* Column 1 */}

          {/* Column 2 */}
          <Col xs={12} md={12} lg={3} xl={3} style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}>
            <div className="my-auto mx-auto" >
              <div className="mt-2">
                <Heading size="md" fontSize="2.5rem">
                  {props.title}
                </Heading>
              </div>
              <div className="mt-2">
                {owner==='' ? 
                (<Flex>
                 <i className="fas fa-user mr-2" style={{
                  display: "inline-block",
                  borderRadius: "60px",
                  boxShadow: "0px 0px 2px #888",
                  padding: "0.5em 0.6em",
                }}></i>{ owner===''?<>Anonymous</>:owner }
                </Flex>)
                :(<Flex>
              <Image borderRadius='full' w={8} h={8} mr={2} src={artistImg} bg='gray.300' alt=" " /> <Text fontWeight='bold' bgGradient='linear(to-r, pink.500, pink.300, blue.500)' bgClip='text'>{owner}</Text>
             </Flex>)
              }
                
              
                
              </div>
              <div className="mt-2">
                <Text fontSize="lg" >
                  Price:{' '}
                  <Text as="span" fontWeight="600">
                    {totalAmount} ꜩ
                  </Text>
                </Text>
              </div>
              <div className="mt-2">
                <MinterButton
                  size="md"
                  variant="primaryAction"
                  w="150px" mt={3}
                  onClick={e => {
                    e.preventDefault();
                    openInNewTab(`/collection/${props.address}/token/${props.id}`);
                  }}
                >
                  <Text>View</Text>
                </MinterButton>
                <div style={{marginLeft: 'auto', marginRight: '0'}}>
                  <button 
                    style={{color: 'black',borderRadius: '3px', backgroundColor: '#00ffbe',padding: '3px' ,position: 'relative', justifyContent: 'flex-end',alignItems: 'flex-end'}}
                    onClick={() => copyToClipboard()}  
                  >
                    <i className="fas fa-share-alt ml-1"></i>
                  </button>
                </div>
              </div>
            </div>
          </Col>
          {/* Column 2 */}
        </Row>
      </Container>
    </>

  );
}
