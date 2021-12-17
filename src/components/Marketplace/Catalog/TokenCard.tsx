import React from 'react';
import { Token } from '../../../reducer/slices/collections';
import { IpfsGatewayConfig } from '../../../lib/util/ipfs';
import { AspectRatio, Box, Flex } from '@chakra-ui/react';
import { TokenMedia } from '../../common/TokenMedia';
import tz from '../../common/assets/tezos-sym-white.svg'
import { Card } from 'react-bootstrap';
import { notifyFulfilled } from '../../../reducer/slices/notificationsActions';
import { useDispatch } from 'react-redux';
import firebase from '../../../lib/firebase/firebase';

interface TokenCardProps extends Token {
  config: IpfsGatewayConfig;
  metadata: any;
}


export default function TokenCard(props: TokenCardProps) {
  const [owner, setOwner] = React.useState('');
  const dispatch = useDispatch();
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
        setOwner(data.name);
        // console.log("Document data:", data);
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
    navigator.clipboard.writeText(`byteblock.art/collection/${props.address}/token/${props.id}`);
    dispatch(notifyFulfilled('1', 'Link copied to clipboard'));
  }


  let royalty: any, royaltyArray , royaltyAmount, royaltyPercentage, totalAmount: any;
  
  if(props.sale){
    if(props.metadata.royalties!==undefined){
      const shares = props.metadata.royalties.shares;
      const decimal = props.metadata.royalties.decimals;
      for(var walletID in shares){
        royalty = shares[walletID];
      }
      royaltyPercentage = royalty*Math.pow(10,-decimal+2);
      royaltyAmount = royaltyPercentage*Math.pow(10,-decimal)*props.sale.price;
      totalAmount = props.sale.price + royaltyAmount;
    }
    else{
      royalty = props.metadata!.attributes?.filter((it: any) => it.name==='Royalty');
      royaltyArray = props.metadata!.attributes?.filter((it: any) => it.name==='Royalty');
      royaltyPercentage = (royaltyArray!==undefined && royaltyArray!.length > 0) ? parseInt(royaltyArray[0].value) : 10;
      royaltyAmount = (props.sale !== undefined && props.sale.seller!==props.metadata.minter) ?  royaltyPercentage*props.sale!.price / 100.0 : 0;
      totalAmount = (props.sale !== undefined) ?  Number((props.sale!.price + royaltyAmount).toFixed(2)) : 0;
    }
  }
  else{
    if(props.metadata?.royalties!==undefined){
      const shares = props.metadata.royalties.shares;
      const decimal = props.metadata.royalties.decimals;
      for(var wallet in shares){
        royalty = shares[wallet];
      }
      royaltyPercentage = royalty*Math.pow(10,decimal-2);
    }
    else{
      royalty = props.metadata!.attributes?.filter((it: any) => it.name==='Royalty');
      royaltyArray = props.metadata!.attributes?.filter((it: any) => it.name==='Royalty');
      royaltyPercentage = (royaltyArray!==undefined && royaltyArray!.length > 0) ? parseInt(royaltyArray[0].value) : 10;
    }
  }

  return (
    <Flex
      position="relative"
      flexDir="column"
      ratio={1}
      w="100%"
      // bg="white"
      border="1px solid"
      borderColor="#eee"
      borderRadius="10px"
      overflow="hidden"
      boxShadow="none"
      transition="all linear 50ms"
      _hover={{
        cursor: 'pointer',
        boxShadow: '0px 0px 10px #3339',
      }}
    >
      {/* {console.log(props)} */}
      {/* {console.log(props.metadata?.attributes)} */}


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
        openInNewTab(`byteblock.art/collection/${props.address}/token/${props.id}`)
      }>
        <Card.Title className="ml-1" >{props.title}</Card.Title>
        {/* <Card.Text>
                This is a wider card with supporting text below as a natural lead-in to
                additional content. This content is a little bit longer.
            </Card.Text> */}
        <p><i className="fas fa-user mr-2" style={{
          display: "inline-block",
          borderRadius: "60px",
          boxShadow: "0px 0px 2px #888",
          padding: "0.5em 0.6em",
        }}></i>
          {
            owner===''?<>Anonymous</>:owner
          }
        </p>
      </Card.Body>
      {/* background-color: cyan; position: relative; left: 22px; top: 0px; display: flex; justify-content: flex-end; align-items: flex-start; */}
      <Card.Footer className="text-white" style={{ backgroundColor: '#000', display: 'flex' }}>
        <Flex        
          onClick={() =>
          openInNewTab(`byteblock.art/collection/${props.address}/token/${props.id}`)
        }>
        <p className="text-muted d-inline mr-2">Price:</p>
        <p className="d-inline"> {totalAmount>0?totalAmount.toFixed(2):'Not on sale'}
          <img src={tz} alt="tz" width={10} height="auto" style={{ display: 'inline-flex' }} className="ml-1" />
        </p>
        </Flex>
        <div style={{marginLeft: 'auto', marginRight: '0'}}>
          <button 
            style={{color: 'black',borderRadius: '3px', backgroundColor: '#00ffbe',padding: '3px' ,position: 'relative', justifyContent: 'flex-end',alignItems: 'flex-end'}}
            onClick={() => copyToClipboard()}  
          >
            Share <i className="fas fa-share-alt ml-1"></i>
          </button>
        </div>
      </Card.Footer>
    </Flex>
  );
}