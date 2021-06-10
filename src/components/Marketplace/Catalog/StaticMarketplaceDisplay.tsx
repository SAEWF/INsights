import React from "react";
import staticMarketplaceData from './staticMarketplaceData.js';
import { Flex, Box, AspectRatio } from '@chakra-ui/react';
import { Image, Card } from 'react-bootstrap';
import tz from '../../common/assets/tezos-sym-white.svg'
import { useLocation } from 'wouter';

export default function StaticMarketplaceDisplay() {
  // console.log(staticMarketplaceData);
  const [, setLocation] = useLocation();

  return (
    <>
      {/* {console.log(staticMarketplaceData.data[idx])}
      {console.log(staticMarketplaceData.data[idx].name)} */}

      { Array.from({ length: 7 }).map((_, idx) => (
        <Box display="grid" transition="250ms padding" padding={1} _hover={{ padding: 0 }} mb={7}>
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
              setLocation(staticMarketplaceData.data[idx].redirectUrl)
              // window.location.href = staticMarketplaceData.data[idx].redirectUrl
            }
          >
            <AspectRatio ratio={3 / 3.5}>
              <Box>
                <Image src={staticMarketplaceData.data[idx].imgUrl} thumbnail />
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
                  <Flex display="block" fontSize="md" width="70%" alignItems="center" height="100%" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">{staticMarketplaceData.data[idx].name}
                  </Flex>
                  <Flex fontSize="md" fontWeight="600" width="30%" justifyContent="flex-end" alignItems="center">
                    {staticMarketplaceData.data[idx].price}
                    <img src={tz} alt="tz" width={10} height="auto" style={{ display: 'inline-block' }} />
                  </Flex>
                </Flex> */}
            <Card.Body>
              <Card.Title style={{ color: '#000' }}>{staticMarketplaceData.data[idx].name}</Card.Title>
              {/* <Card.Text>
                        This is a wider card with supporting text below as a natural lead-in to
                        additional content. This content is a little bit longer.
                    </Card.Text> */}
              <p><i className="fas fa-user mr-2" style={{
                display: "inline-block",
                borderRadius: "60px",
                boxShadow: "0px 0px 2px #888",
                padding: "0.5em 0.6em",
              }}></i> {staticMarketplaceData.data[idx].artist}</p>
            </Card.Body>
            <Card.Footer className="text-white" style={{ backgroundColor: '#000' }}>
              <p className="text-muted d-inline mr-2">Price:</p>
              <p className="d-inline">{staticMarketplaceData.data[idx].price}
                <img src={tz} alt="tz" width={10} height="auto" style={{ display: 'inline-block' }} className="ml-1" />
              </p>
            </Card.Footer>
          </Flex>
        </Box>
      ))
      }
    </>
  );
}