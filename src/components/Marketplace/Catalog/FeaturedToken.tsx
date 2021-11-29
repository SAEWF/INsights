import React from 'react';
import { Token } from '../../../reducer/slices/collections';
import { useLocation } from 'wouter';
import { IpfsGatewayConfig } from '../../../lib/util/ipfs';
import {
  // Flex,
  Text,
  Heading,
} from '@chakra-ui/react';
import { notifyFulfilled } from '../../../reducer/slices/notificationsActions';
import { useDispatch } from 'react-redux';
import { MinterButton } from '../../common';
import { TokenMedia } from '../../common/TokenMedia';
import tz from '../../common/assets/tezos-sym-white.svg';
import { Container, Row, Col } from 'react-bootstrap';
import firebase from '../../../lib/firebase/firebase';

interface FeaturedTokenProps extends Token {
  config: IpfsGatewayConfig;
}

export default function FeaturedToken(props: FeaturedTokenProps) {
  const [, setLocation] = useLocation();
  const [owner, setOwner] = React.useState('');
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`byteblock.art/collection/${props.address}/token/${props.id}`);
    dispatch(notifyFulfilled('1', 'Link copied to clipboard'));
  }
  
  const openInNewTab = (url: string) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }

  const royaltyArray = props.metadata!.attributes?.filter(it => it.name==='Royalty');
  const royaltyPercentage = (royaltyArray!==undefined && royaltyArray!.length > 0) ? parseInt(royaltyArray[0].value) : 10;
  const royaltyAmount = (props.sale !== undefined && props.sale !== null && props.sale.seller!==props.metadata.minter) ?  royaltyPercentage*props.sale!.price / 100.0 : 0;
  const totalAmount = (props.sale !== undefined && props.sale !== null) ?  Number((props.sale!.price + royaltyAmount).toFixed(2)) : 0;

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
              </div>
              <div className="mt-2">
                <Text fontSize="lg" >
                  Price:{' '}
                  <Text as="span" fontWeight="600">
                    {totalAmount} <img src={tz} alt="" width={10} height="auto" style={{ display: 'inline-block' }} />
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
