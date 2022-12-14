import React, { useEffect } from 'react';
import {
  Flex,
  Heading,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption
} from '@chakra-ui/react';
// import { CreateCollectionButton } from '../common/modals/CreateCollection';
import { useSelector, useDispatch } from '../../reducer';
import { selectCollection } from '../../reducer/slices/createNft';
import { getWalletAssetContractsQuery } from '../../reducer/async/queries';
import { ChevronDown } from 'react-feather';
import Spinner from 'react-bootstrap/Spinner'
import CreateBaseCollection from './CreateBaseCollection.js'

export default function CollectionSelect() {
  const collections = useSelector(s => s.collections.collections);
  const state = useSelector(s => s.createNft);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getWalletAssetContractsQuery());
  }, [collections, dispatch]);

  // console.log(collections);
  // if (Object.entries(collections).length !== 0) {
  //   console.log('collections is not empty');
  // } else {
  //   console.log('collections is empty');
  // }

  const secondaryCollections = ['Kraznik', 'hash3points', 'Hicetnunc', 'Kalamint', 'Geckos Skratz'];
  return (
    <>
      <CreateBaseCollection />
      <Flex pb={8} flexDir="column">
        <Flex pb={4} align="center" justify="space-between">
          <Heading size="md">Select a Collection</Heading>
          {/* <CreateCollectionButton sync={true} /> 
          commented for hidden new collection button*/}
        </Flex>
        <Menu>
          <MenuButton
            as={Button}
            border="1px solid"
            borderColor="brand.gray"
            fontSize="lg"
            fontWeight="normal"
            py={3}
            height="auto"
            // backgroundColor="white"
            color={state.collectionAddress ? 'white' : 'brand.gray'}
          >
            <Flex align="center">
              <Box mr={3}>
                <ChevronDown />
              </Box>
              {(state.collectionAddress &&
                collections[state.collectionAddress]?.metadata?.name) ||
                'Collection'}
            </Flex>
          </MenuButton>
          <MenuList>
            <MenuOptionGroup
              type="radio"
              defaultValue={state.collectionAddress || ''}
            >
              {(Object.entries(collections).length !== 0) ?

                Object.keys(collections).map(address => {
                  // block secondary sales and objkt collections from being selected to mint tokens
                  if(!secondaryCollections.includes(collections[address].metadata.name) && collections[address].creator.address!=='KT1Aq4wWmVanpQhq4TTfjZXB5AjFpx15iQMM')
                  return(
                  <MenuItemOption
                    key={address}
                    value={address}
                    selected={address === state.collectionAddress}
                    onClick={() => dispatch(selectCollection(address))}
                  >
                    {collections[address].metadata.name}
                  </MenuItemOption>
                  )
                  else return <></>
                })
                :
                <MenuItemOption disabled>
                  <Spinner animation="border" size="sm" className="mr-2" /> Wait while we fetch your collection(s)
              </MenuItemOption>
              }
            </MenuOptionGroup>
          </MenuList>
        </Menu>
      </Flex >
    </>
  );
}
