import React from 'react';
import { Token } from '../../../reducer/slices/collections';
import { useLocation } from 'wouter';
import { IpfsGatewayConfig } from '../../../lib/util/ipfs';
import { AspectRatio, Box, Flex } from '@chakra-ui/react';
import { TokenMedia } from '../../common/TokenMedia';
import tz from '../../common/assets/tezos-sym-white.svg'
import { Card } from 'react-bootstrap';

interface TokenCardProps extends Token {
  config: IpfsGatewayConfig;
}

export default function TokenCard(props: TokenCardProps) {
  const [, setLocation] = useLocation();
  return (
    <Flex
      position="relative"
      flexDir="column"
      ratio={1}
      w="100%"
      bg="white"
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
        setLocation(`/collection/${props.address}/token/${props.id}`)
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
      <Card.Body>
        <Card.Title style={{ color: '#000' }}>{props.title}</Card.Title>
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
          {/* {(props.metadata?.attributes?.length === 0)
            ? <>Anonymous</>
            // eslint-disable-next-line
            : props.metadata?.attributes?.map(({ name, value }) => {
              if (name === "Artist") {
                return (
                  <>{value || 'Anonymous'}</>
                )
              }
            })} */}
          {(props.metadata?.attributes?.length === 0)
            ? <>Anonymous</>
            // eslint-disable-next-line
            : props.metadata?.attributes?.map(({ name, value }, idx) => {
              if ((name === "Artist" || name === "3D - CGI") && value !== '') {
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
      </Card.Body>

      <Card.Footer className="text-white" style={{ backgroundColor: '#000' }}>
        <p className="text-muted d-inline mr-2">Price:</p>
        <p className="d-inline"> {props.sale?.price}
          <img src={tz} alt="tz" width={10} height="auto" style={{ display: 'inline-block' }} className="ml-1" />
        </p>
      </Card.Footer>

    </Flex>
  );
}