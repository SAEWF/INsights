import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Link,
  SimpleGrid,
  Spinner,
  Text
} from '@chakra-ui/react';
import { MinterButton } from '../../common';
import { ChevronLeft, ExternalLink, Wind } from 'react-feather';
import { useDispatch, useSelector } from '../../../reducer';
import {
  // getContractNftsQuery,
  getCollectionNftsQuery,
  getNftAssetContractQuery,
  loadMoreCollectionNftsQuery
} from '../../../reducer/async/queries';
import { Pagination } from 'react-bootstrap'
import CollectionsDropdown from './CollectionsDropdown';
import TokenCard from '../../common/TokenCard';
import {useColorModeValue } from '@chakra-ui/react';

interface CollectionDisplayProps {
  address: string | null;
  ownedOnly?: boolean;
}

export default function CollectionDisplay({
  address,
  ownedOnly = true
}: CollectionDisplayProps) {
  const CardsPerPage = 12;
  const collections = useSelector(s => s.collections);
  const { config, tzPublicKey, wallet } = useSelector(s => s.system);
  const dispatch = useDispatch();
  const [active, setActive] = useState(1);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(CardsPerPage);
  const bg = useColorModeValue('gray.100', 'black');

  useEffect(() => {
    if (address !== null) {
      console.log('getCollectionNftsQuery', address);
      dispatch(getNftAssetContractQuery(address)).then(() =>
        dispatch(getCollectionNftsQuery({ address: address }))
      );
    }
  }, [address, dispatch, ownedOnly]);

  const loadMore = (pageNumber: number, collectionAddress: string) => {
    console.log('loadMoreCollectionNftsQuery', pageNumber, collectionAddress);
    dispatch(loadMoreCollectionNftsQuery({page:pageNumber, address: collectionAddress}));
  };

  if (address === null) {
    return (
      <Flex w="100%" flex="1" flexDir="column" align="center">
      <Flex
        px={20}
        py={10}
        bg="gray.200"
        textAlign="center"
        align="center"
        borderRadius="5px"
        flexDir="column"
        fontSize="xl"
        color="gray.400"
        mt={28}
      >
        <Wind />
        <Text fontWeight="600" pt={5}>
          Select a collection to view your tokens
        </Text>
      </Flex>
    </Flex>
    );
  }

  const collection = collections.collections[address];

  if (!collection) {
    return <></>;
  }

  if (!collection.loaded) {
    return (
      <Flex flexDir="column" align="center" flex="1" pt={20}>
        <Spinner size="xl" mb={6} color="gray.300" />
        <Heading size="lg" textAlign="center" color="gray.500">
          Loading...
        </Heading>
      </Flex>
    );
  }

  if (collection.tokens === null) {
    return <></>;
  }

  const tokens = ownedOnly
    ? collection.tokens.filter(
        ({ owner, sale }) =>
          owner === tzPublicKey || sale?.seller === tzPublicKey
      )
    : collection.tokens;

      // PAGINATION
  let items = [];
  const numberOfPages = Math.ceil((tokens.length-1) / CardsPerPage);
  for (let number = 1; number <= numberOfPages; number++) {
    items.push(
      <Pagination.Item key={number} active={number === active} onClick={()=>{
        setActive(number);
        setStart((number-1)*CardsPerPage);
        setEnd(Math.min(tokens?.length ?? 0, number*CardsPerPage));
        // console.log('start', start, 'end', end);
        loadMore(number, address);
      }}>
        {number}
      </Pagination.Item>
    );
  }

  const handleFirst = () =>{
    setActive(1);
    setStart(0);
    setEnd(CardsPerPage);
    loadMore(1, address);
  }
  const handlePrev = () =>{
    if(active > 1){
      setActive(active-1);
      setStart(start-CardsPerPage);
      setEnd(end-CardsPerPage);
      loadMore(active-1, address);
    }
  }
  const handleNext = () =>{
    if(active < numberOfPages){
      setActive(active+1);
      setStart(start+CardsPerPage);
      setEnd(end+CardsPerPage);
      loadMore(active+1, address);
    }
  }
  const handleLast = () =>{
    setActive(numberOfPages);
    setStart((numberOfPages-1)*CardsPerPage + 1);
    setEnd(tokens?.length ?? 0);
    loadMore(numberOfPages, address);
  }

  const PaginationWithEllipses = (
    <Box bg={bg}>
    <Pagination size="lg" id="paginate">
      <Pagination.First onClick ={handleFirst} />
      <Pagination.Prev onClick={handlePrev} />
      {items.slice(0, 1)}
      <Pagination.Ellipsis />
      {
          (active===1) ?
          items.slice(active, active+3)
            :
          <></>
      }
      {
          (active===numberOfPages) ?
          items.slice(active-3, active)
            :
          <></>
      }
      {
          (active===2) ?
          items.slice((active-1), (active+2))
            :
          <></>
      }
      {
          (active===numberOfPages-1) ?
          items.slice((active-3), (active))
            :
          <></>
      }
      {
        (active!==1 && active!==2 && active!==numberOfPages-1 && active!==numberOfPages) ?
          items.slice((active-2), (active+1))
          :
          <></>  
      }
      <Pagination.Ellipsis />
      {items.slice(items.length-1, items.length)}
      <Pagination.Next onClick={handleNext}/>
      <Pagination.Last onClick={handleLast}/>
    </Pagination>
    </Box>
  )

  if (tokens.length === 0) {
    return (
      <Flex w="100%" flex="1" flexDir="column" align="center">
        <Flex
          px={20}
          py={10}
          bg="gray.200"
          textAlign="center"
          align="center"
          borderRadius="5px"
          flexDir="column"
          fontSize="xl"
          color="gray.400"
          mt={28}
        >
          <Wind />
          <Text fontWeight="600" pt={5}>
            {ownedOnly
              ? 'No owned tokens to display in this collection'
              : 'No tokens to display in this collection'}
          </Text>
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex
      flexDir="column"
      h="100%"
      w="100%"
      flex="1"
      bg="brand.brightGray"
      borderLeftWidth="1px"
      borderLeftColor="brand.lightBlue"
      overflowY="scroll"
      justify="start"
    >
      <Flex flexDir="row">
        <Flex justifyContent="flex-start" width="4rem">
          <MinterButton
            variant="primaryActionInverted"
            onClick={e => {
              e.preventDefault();
              window.history.back();
            }}
          >
            <Box color="currentcolor">
              <ChevronLeft size={24} strokeWidth="3" />
            </Box>
          </MinterButton>
        </Flex>

        <Flex
            flexDir="column"
            px={{ base: 6, md: 10 }}
            pt={6}
            overflow="hidden"
        >
          {ownedOnly && wallet !== null ? (
            <Flex display={{ base: 'flex', md: 'none' }} mb={4}>
              <CollectionsDropdown />
            </Flex>
          ) : null}
          <Flex
            w="100%"
            pb={6}
            justify="space-between"
            align={{
              base: 'flex-start',
              md: 'center'
            }}
            flexDir={{
              base: 'column',
              md: 'row'
            }}
          >
            <Flex flexDir="column" width="100%">
              <Flex justify="space-between" width="100%">
                <Heading size="lg">{collection.metadata.name || ''}</Heading>
              </Flex>
              <Flex align="center">
                <Text 
                  fontFamily="mono" 
                  color="brand.lightGray"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  overflowWrap="normal"
                >
                  {collection.address}
                </Text>
                <Link
                  href={`${config.bcd.gui}/${config.network}/${collection.address}`}
                  color="brand.darkGray"
                  isExternal
                  ml={2}
                >
                  <ExternalLink size={16} />
                </Link>
              </Flex>
            </Flex>
            {collection.metadata.description }
          </Flex>
        </Flex>
      </Flex>
      <SimpleGrid columns={{ sm: 1, md: 2, lg: 3, xl: 4 }} gap={8} px={{ base: 6, md: 10 }} pb={8}>
        {tokens.slice(start, end).map(token => {
          return (
            <TokenCard
              key={address + token.id}
              address={address}
              config={config}
              {...token}
            />
          );
        })}
      </SimpleGrid>
      {
        (tokens?.length ?? 0) < CardsPerPage ? 
          null
          :
          PaginationWithEllipses
      }
    </Flex>
  );
}
