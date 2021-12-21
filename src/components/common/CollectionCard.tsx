import React from 'react';
import { Image } from '@chakra-ui/react'
import { useLocation } from 'wouter';
import { AspectRatio, Box, Flex } from '@chakra-ui/react';
import src from './assets/logo_bb.png'

interface CollectionCardProps {
  address: string;
  name: string;
}

export default function TokenCard(props: CollectionCardProps) {
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
      borderRadius="0px"
      overflow="hidden"
      boxShadow="none"
      transition="all linear 50ms"
      _hover={{
        cursor: 'pointer',
        boxShadow: '0px 0px 10px #3339',
      }}
      onClick={() =>
        setLocation(`/collection/${props.address}/`)
      }
    >
      <AspectRatio ratio={3 / 2}>
        <Box>
          <Image
            src={src}
            flex="1"
            maxWidth="2xl"
            maxHeight="2xl"
            style={{ objectFit: 'cover', maxWidth: "100%", maxHeight: "100%" , cursor: 'pointer' }}
            // onClick={props.onClick as MouseEventHandler<HTMLImageElement>}
            // onError={() => setErrored(true)}
          />
        </Box>
      </AspectRatio>
      <Flex
        width="50%"
        px={4}
        py={4}
        bg="white"
        borderTop="1px solid"
        borderColor="brand.lightBlue"
        flexDir="row"
        color="black"
        justifyContent="space-between"
      >
        <Flex display="block" fontSize="md" width="70%" alignItems="center" height="100%" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">{props.name}</Flex>
      </Flex>
    </Flex>
  );
}