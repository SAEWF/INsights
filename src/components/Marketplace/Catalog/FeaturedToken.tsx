import React from 'react';
import { Token } from '../../../reducer/slices/collections';
import { useLocation } from 'wouter';
import { IpfsGatewayConfig } from '../../../lib/util/ipfs';
import {
  // Flex,
  Text,
  Heading,
} from '@chakra-ui/react';
import { MinterButton } from '../../common';
import { TokenMedia } from '../../common/TokenMedia';
import tz from '../../common/assets/tezos-sym-white.svg';
import { Container, Row, Col } from 'react-bootstrap';

interface FeaturedTokenProps extends Token {
  config: IpfsGatewayConfig;
}

export default function FeaturedToken(props: FeaturedTokenProps) {
  const [, setLocation] = useLocation();
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
                  {(props.metadata?.attributes?.length === 0)
                    ? <>Anonymous</>
                    // eslint-disable-next-line
                    : props.metadata?.attributes?.map(({ name, value }, idx) => {
                      if (name === "Artist" && value !== '') {
                        return (
                          <>{value}</>
                        )
                      }
                      else if (idx === 0) {
                        return (
                          <>Anonymous</>
                        )
                      }
                    })}
                </p>
              </div>
              <div className="mt-2">
                <Text fontSize="lg" >
                  Price:{' '}
                  <Text as="span" fontWeight="600">
                    {props.sale?.price} <img src={tz} alt="" width={10} height="auto" style={{ display: 'inline-block' }} />
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
                    setLocation(`/collection/${props.address}/token/${props.id}`, {
                      replace: false
                    });
                  }}
                >
                  <Text>View</Text>
                </MinterButton>
              </div>
            </div>
          </Col>
          {/* Column 2 */}
        </Row>
      </Container>
    </>

  );
}
