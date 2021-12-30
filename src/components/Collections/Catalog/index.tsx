import React, { useEffect } from 'react';
import { Flex, Heading, Text, Link, Image } from '@chakra-ui/react';
import Sidebar from './Sidebar';
import CollectionDisplay from './CollectionDisplay';
import { useSelector, useDispatch } from '../../../reducer';
import {
  getWalletAssetContractsQuery,
  getNftAssetContractQuery
} from '../../../reducer/async/queries';
import { selectCollection } from '../../../reducer/slices/collections';
import { connectWallet } from '../../../reducer/async/wallet';
import logo from '../../common/assets/splash-logo.svg';
import { MinterButton } from '../../common';

export default function Catalog() {
  const system = useSelector(s => s.system);
  const collections = useSelector(s => s.collections);
  const dispatch = useDispatch();

  const globalCollection =
    collections.collections[collections.globalCollection];

  const kraznik = collections.collections['KT1C1pT3cXyRqD22wHdgmtJjffFG4zKKhxhr'];
  const hash3points = collections.collections['KT1Fxz4V3LaUcVFpvF8pAAx8G3Z4H7p7hhDg'];
  const HEN = collections.collections['KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton'];
  const kalamint = collections.collections['KT1EpGgjQs73QfFJs9z7m1Mxm5MTnpC2tqse'];
  
  

  useEffect(() => {
    if (!globalCollection) {
      dispatch(getNftAssetContractQuery(collections.globalCollection));
      return;
    }
    else if(globalCollection!== undefined && kraznik===undefined ) {
      dispatch(getNftAssetContractQuery('KT1C1pT3cXyRqD22wHdgmtJjffFG4zKKhxhr'));
    }
    else if(globalCollection!== undefined && hash3points===undefined ) {
      dispatch(getNftAssetContractQuery('KT1Fxz4V3LaUcVFpvF8pAAx8G3Z4H7p7hhDg'));
    }
    else if(globalCollection!== undefined && HEN===undefined ) {
      dispatch(getNftAssetContractQuery('KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton'));
    }
    else if(globalCollection!== undefined && kalamint===undefined ) {
      dispatch(getNftAssetContractQuery('KT1EpGgjQs73QfFJs9z7m1Mxm5MTnpC2tqse'));
    }
    // if (collections.selectedCollection === null) {
    //   // dispatch(selectCollection(collections.globalCollection));
    //   return;
    // }
  }, [
    globalCollection,
    collections.selectedCollection,
    collections.globalCollection,
    kraznik,
    kalamint,
    hash3points,
    HEN,
    dispatch
  ]);

  useEffect(() => {
    if (system.status === 'WalletConnected') {
      dispatch(getWalletAssetContractsQuery());
    }
  }, [system.status, dispatch]);

  const selectedCollection = collections.selectedCollection;
  if (system.walletReconnectAttempted && system.status !== 'WalletConnected') {
    return (
      <Flex
        align="center"
        justifyContent="space-between"
        w="100%"
        flex="1"
        flexDir="column"
        bg="brand.background"
      >
        <Flex flexDir="column" align="center" maxW="600px" pt={20}>
          <Image src={logo} maxW="200px" pb={40} />
          <Heading color="white" size="xl" pb={8}>
            Create NFTs on Tezos
          </Heading>
          <Flex minW="400px" justify="center" pb={20}>
            <MinterButton
              variant="secondaryActionLined"
              onClick={e => {
                e.preventDefault();
                dispatch(connectWallet());
              }}
            >
              Connect your wallet
            </MinterButton>
          </Flex>
        </Flex>
        <Flex
          width="100%"
          bg="brand.darkGray"
          color="brand.lightGray"
          fontFamily="mono"
          paddingX={10}
          paddingY={4}
          justifyContent="space-between"
        >
          <Text fontSize="xs">
            OpenMinter Version v{process.env.REACT_APP_VERSION}
          </Text>
          <Flex>
            <Link
              fontSize="xs"
              textDecor="underline"
              href="https://github.com/tqtezos/minter"
            >
              GitHub
            </Link>
          </Flex>
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex
      flex="1"
      w="100%"
      minHeight="0"
      flexDir={{
        base: 'column',
        md: 'row'
      }}
    >
      <Flex
        w="250px"
        h="100%"
        flexDir="column"
        overflowY="scroll"
        display={{
          base: 'none',
          md: 'flex'
        }}
      >
        <Sidebar />
      </Flex>
      <CollectionDisplay address={selectedCollection} />
    </Flex>
  );
}
