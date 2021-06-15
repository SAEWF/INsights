import React from 'react';
import { Token } from '../../../reducer/slices/collections';
import { useLocation } from 'wouter';
import { IpfsGatewayConfig } from '../../../lib/util/ipfs';
import {
  Box,
  Flex,
  Text,
  Heading
} from '@chakra-ui/react';
import { MinterButton } from '../../common';
import { TokenMedia } from '../../common/TokenMedia';
import tz from '../../common/assets/tezos-sym.svg';

interface FeaturedTokenProps extends Token {
  config: IpfsGatewayConfig;
}

export default function FeaturedToken(props: FeaturedTokenProps) {
  const [, setLocation] = useLocation();
  return (
    <Flex flexDir="row" flexWrap="wrap" mb={8} width="100%" h="70vh" justifyContent="center"> {/* edit 70 vh for vertical height */}
      <Flex maxHeight={['45vh', '65vh']} marginRight={[0, 8]} justifyContent="center" width={['85vw', '65vw', '45vw']}>
        <TokenMedia
          maxW="100%"
          class="featured"
          {...props}
        />
      </Flex>
      <Box marginLeft="0 !important">
        <Flex flexDir="column" w={['100%', '35vw']} justifyContent="center" alignItems="center" >
          <Heading size="md" mt={6} fontSize="2.5rem">
            {props.title}
          </Heading>
          <br />
          {/* artist name */}
          <p className="mt-2"><i className="fas fa-user mr-2" style={{
            display: "inline-block",
            borderRadius: "60px",
            boxShadow: "0px 0px 2px #888",
            padding: "0.5em 0.6em",
          }}></i>
            {(props.metadata?.attributes?.length === 0)
              ? <>Anonymous</>
              : props.metadata?.attributes?.map(({ name, value }) => (
                <>{value}</>
              ))}
          </p>
          {/* artist name */}

          <Text fontSize="lg" mt={1}>
            Price:{' '}
            <Text as="span" fontWeight="600">
              {props.sale?.price} <img src={tz} alt="" width={10} height="auto" style={{ display: 'inline-block' }} />
            </Text>
          </Text>
          <br />
          <MinterButton
            size="md"
            variant="primaryAction"
            w="150px" mt={2}
            onClick={e => {
              e.preventDefault();
              setLocation(`/collection/${props.address}/token/${props.id}`, {
                replace: false
              });
            }}
          >
            <Text>View</Text>
          </MinterButton>
        </Flex>
      </Box>
    </Flex>
  );
}
