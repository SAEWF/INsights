import React from 'react';
import { Token } from '../../../reducer/slices/collections';
import { IpfsGatewayConfig } from '../../../lib/util/ipfs';
import { AspectRatio, Box, Flex } from '@chakra-ui/react';
import { TokenMedia } from '../../common/TokenMedia';
import tz from '../../common/assets/tezos-sym-white.svg'
import { Card } from 'react-bootstrap';
import firebase from '../../../lib/firebase/firebase';

interface TokenCardProps extends Token {
  config: IpfsGatewayConfig;
}


export default function TokenCard(props: TokenCardProps) {
  const [owner, setOwner] = React.useState('');

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

  const royaltyArray = (props.metadata!==undefined)?props.metadata!.attributes?.filter(it => it.name==='Royalty') : undefined;
  const royaltyPercentage = (royaltyArray!==undefined && royaltyArray!.length > 0) ? parseInt(royaltyArray[0].value) : 10;
  const royaltyAmount = (props.sale !== undefined && props.sale !== null && props.sale.seller!==props.metadata.minter) ?  royaltyPercentage*props.sale!.price / 100.0 : 0;
  const totalAmount = (props.sale !== undefined && props.sale !== null) ?  Number((props.sale!.price + royaltyAmount).toFixed(2)) : 0;

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
      onClick={() =>
        openInNewTab(`/collection/${props.address}/token/${props.id}`)
      }
    >
      {/* {console.log(props)} */}
      {/* {console.log(props.metadata?.attributes)} */}


      <AspectRatio ratio={3 / 3.5}>
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
      <Card.Body className="ml-2">
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
      <Card.Footer className="text-white" style={{ backgroundColor: '#000' }}>
      <p className="text-muted d-inline mr-2">Price:</p>

        <p className="d-inline"> {totalAmount>0?totalAmount.toFixed(2):'Not on sale'}
          <img src={tz} alt="tz" width={10} height="auto" style={{ display: 'inline-block' }} className="ml-1" />
        </p>
      </Card.Footer>
    </Flex>
  );
}