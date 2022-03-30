import React, { useEffect, useState } from 'react';
import {
  Link,
  Box,
  Button,
  Flex,
  Heading,
  Menu,
  MenuList,
  Modal,
  ModalCloseButton,
  ModalContent,
  Text,
  useDisclosure,
  Container,
  Spinner,
} from '@chakra-ui/react';
import { ChevronLeft, HelpCircle, MoreHorizontal } from 'react-feather';
import { MinterButton, MinterMenuButton, MinterMenuItem } from '../../common';
import { TransferTokenModal } from '../../common/modals/TransferToken';
import { BurnTokenButton } from '../../common/modals/BurnToken';

import { SellTokenButton } from '../../common/modals/SellToken';
import { CancelTokenSaleButton } from '../../common/modals/CancelTokenSale';
import { BuyTokenButton } from '../../common/modals/BuyToken';
import { useSelector, useDispatch } from '../../../reducer';
import {
  getContractNftQuery,
  getNftAssetContractQuery
} from '../../../reducer/async/queries';
import { TokenMedia } from '../../common/TokenMedia';
import { Maximize2 } from 'react-feather';
import firebase from '../../../lib/firebase/firebase'
import { ConfigureTokenButton } from '../../common/modals/ConfigureAuction';
import { BidTokenButton } from '../../common/modals/BidToken';
import { ResolveTokenAuctionButton } from '../../common/modals/ResolveToken';
import { CancelTokenAuctionButton } from '../../common/modals/CancelTokenAuction'
import Timer from '../../Auction/Catalog/Timer';


function NotFound() {
  return (
    <Flex flex="1" width="100%" justify="center">
      <Flex w="100%" flex="1" flexDir="column" align="center">
        <Flex
          px={32}
          py={16}
          bg="gray.100"
          textAlign="center"
          align="center"
          borderRadius="5px"
          flexDir="column"
          fontSize="xl"
          borderColor="gray.200"
          borderWidth="5px"
          mt={36}
          color="gray.300"
        >
          <HelpCircle size="100px" />
          <Heading size="xl" fontWeight="normal" pt={8} color="gray.400">
            Token not found
          </Heading>
        </Flex>
      </Flex>
    </Flex>
  );
}


interface TokenDetailProps {
  contractAddress: string;
  tokenId: number;
}

const getIPFSlink = (hash: string) =>{
    const cid = hash.replace(':','');
    const fcid = cid.replace('//', '/');
    return `https://tqtezos.mypinata.cloud/${fcid}`;
}

function TokenDetail({ contractAddress, tokenId }: TokenDetailProps) {
  const { system, collections: state } = useSelector(s => s);
  const disclosure = useDisclosure();
  const dispatch = useDispatch();
  const collection = state.collections[contractAddress];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tokenHook, setTokenHook] = useState<any>(null);

  const [owner, setOwner] = useState<any[]>([]);
  const [creator, setCreator] = useState<any[]>([]);

  const collectionUndefined = collection === undefined;

  useEffect(() => {
    if (collectionUndefined) {
      console.log(collection);
      dispatch(getNftAssetContractQuery(contractAddress));
    }
    else{
      dispatch(getContractNftQuery({ address: contractAddress , tokenID: tokenId}));
    }

    if(!collectionUndefined && tokenHook!==null && tokenHook!==undefined && owner.length===0){
      var walletAddress ;
      if(tokenHook.sale!==null && tokenHook.sale!==undefined){
        walletAddress = tokenHook.sale.seller;
      }
      else if(tokenHook.auction){
        walletAddress = tokenHook.auction.seller;
      }
      else{
        walletAddress = tokenHook.owner;
      }
      const hook = firebase.firestore().collection('artists').doc(walletAddress);
      hook.onSnapshot(doc => {
        if(doc.exists && doc.data()!.display!==undefined && doc.data()!.display){
          const data = doc.data();
          var temp = [];
          temp.push({id: doc.id, ...data});
          setOwner(temp);
        }
      })
    }

    if(!collectionUndefined &&tokenHook!==null && tokenHook!==undefined && creator.length===0){
      var WalletAddress ;
      if(tokenHook.metadata.symbol==='OBJKTCOM'){
        WalletAddress = Object.keys(tokenHook.metadata?.royalties.shares)[0];
      }else{
        WalletAddress = tokenHook.metadata.minter;
      }
      const hook = firebase.firestore().collection('artists').doc(WalletAddress);
      hook.onSnapshot(doc => {
        if(doc.exists){
          const data = doc.data();
          if(data!.display!==undefined && data!.display){
            var temp = [];
            temp.push({id: doc.id, ...data});
            setCreator(temp);
          }
        }
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractAddress, collectionUndefined, dispatch, tokenHook]);

  if (!collection?.tokens) {
    return(
      <Container className="main-container">
        <Flex flexDir="column" align="center" flex="1" pt={20}>
          <Spinner size="xl" mb={6} color="gray.300" />
          <Heading size="lg" textAlign="center" color="gray.500">
            Loading...
          </Heading>
        </Flex>
      </Container>
    )
  }

  const token = collection.tokens.find(token => token.id === tokenId);

  if (!token) {
    return <NotFound />;
  }

  if ((tokenHook===undefined || tokenHook===null) && token) {
    setTokenHook(token);
  }

  const isOwner =
    system.tzPublicKey &&
    (system.tzPublicKey === token.owner ||
      system.tzPublicKey === token.sale?.seller ||
        system.tzPublicKey === token.auction?.seller);
  // for viewing the token in console , turn it on
  // console.log("OWNER + ", owner);
  // console.log("TOKEN =", token);


  let royalty: any, royaltyArray , royaltyAmount, royaltyPercentage, totalAmount: any, creatorAddress, ownerAddress;
  
  if(token.sale && tokenHook){
    if(tokenHook.metadata.royalties!==undefined){
      const shares = tokenHook.metadata.royalties.shares;
      const decimal = tokenHook.metadata.royalties.decimals;
      for(var walletID in shares){
        royalty = shares[walletID];
      }
      if(tokenHook.metadata.creators[0]==="KraznikDAO")
        royaltyPercentage = 3;
      else if(tokenHook.metadata.creators[0]==="deconcept.tez")
        royaltyPercentage = 5;
      else 
        royaltyPercentage = royalty*Math.pow(10,-decimal+2);
        
      royaltyAmount = royalty*Math.pow(10,-decimal)*token.sale.price;

      creatorAddress = Object.keys(tokenHook.metadata?.royalties.shares)[0];
      ownerAddress = tokenHook.sale.seller;

      if(creatorAddress===ownerAddress){
        totalAmount = token.sale.price;
      }
      else{
        totalAmount = token.sale.price + royaltyAmount;
      }
    }
    // hicetnunc
    else if(tokenHook.metadata.symbol && tokenHook.metadata.symbol==="OBJKT"){
      royaltyPercentage = 10;
      royaltyAmount = token.sale.price*0.1;
      creatorAddress = tokenHook.metadata.creators[0];
      ownerAddress = tokenHook.sale.seller;
      if(creatorAddress===ownerAddress){
        totalAmount = token.sale.price;
      }
      else{
        totalAmount = token.sale.price + royaltyAmount;
      }
    }
    // kalamint
    else if(tokenHook.metadata?.creatorRoyalty!==undefined){
      royaltyPercentage = tokenHook.metadata?.creatorRoyalty;
      royaltyAmount = token.sale.price*royaltyPercentage/100;
      creatorAddress = tokenHook.metadata.creators[0]; 
      ownerAddress = tokenHook.sale.seller;
      if(creatorAddress===ownerAddress){
        totalAmount = token.sale.price;
      }
      else{
        totalAmount = token.sale.price + royaltyAmount;
      }
    }
    else{
      royalty = token.metadata!.attributes?.filter((it: any) => it.name==='Royalty');
      royaltyArray = token.metadata!.attributes?.filter((it: any) => it.name==='Royalty');
      royaltyPercentage = (royaltyArray!==undefined && royaltyArray!.length > 0) ? parseInt(royaltyArray[0].value) : 10;
      royaltyAmount = royaltyPercentage*token.sale!.price / 100.0 ;
      creatorAddress = tokenHook.metadata.minter;
      ownerAddress = tokenHook.sale.seller;
      if(creatorAddress===ownerAddress){
        totalAmount = token.sale.price;
      }
      else{
        totalAmount = token.sale.price + royaltyAmount;
      }
    }
  }
  else if(tokenHook){
    if(tokenHook.metadata?.royalties!==undefined){
      const shares = tokenHook.metadata.royalties.shares;
      const decimal = tokenHook.metadata.royalties.decimals;
      for(var wallet in shares){
        creatorAddress = wallet;
        royalty = shares[wallet];
      }
      if(tokenHook.metadata.creators[0]==="KraznikDAO")
        royaltyPercentage = 3;
      else if(tokenHook.metadata.creators[0]==="deconcept.tez")
        royaltyPercentage = 5;
      else 
        royaltyPercentage = royalty*Math.pow(10,-decimal+2);
    }
    else if(tokenHook.metadata?.symbol && tokenHook.metadata.symbol==="OBJKT"){
      royaltyPercentage = 10;
      creatorAddress = tokenHook.metadata.creators[0];
    }
    else if(tokenHook.metadata?.creatorRoyalty!==undefined){
      royaltyPercentage = tokenHook.metadata?.creatorRoyalty;
    }
    else{
      creatorAddress = tokenHook.metadata.minter;
      royalty = tokenHook.metadata!.attributes?.filter((it: any) => it.name==='Royalty');
      royaltyArray = tokenHook.metadata!.attributes?.filter((it: any) => it.name==='Royalty');
      royaltyPercentage = (royaltyArray!==undefined && royaltyArray!.length > 0) ? parseInt(royaltyArray[0].value) : 10;
    }
  }

  if(token.auction && tokenHook){
    ownerAddress = token.auction.seller;
    royalty = royaltyPercentage*token.auction.current_bid;
  }

  return (
    
    <Flex flexDir="column"  flexGrow={1}>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="full"
        scrollBehavior="inside"
      >
        <ModalContent
          height="100vh"
          maxHeight="unset"
          width="100vw"
          display="flex"
          flexDirection="column"
          flexWrap="nowrap"
          justifyContent="center"
          alignItems="center"
          position="relative"
          backgroundColor="#111111fc"
          zIndex="2000"
          margin="0 !important"
          borderRadius="0"
        >
          <TokenMedia
            key={`${token.address}-${token.id}`}
            config={system.config}
            {...token}
            metadata={token?.metadata}
            maxW="95vw"
            maxH="95vh"
            objectFit="scale-down"
          />
          <ModalCloseButton
            position="absolute"
            right="0px !important"
            display="block !important"
            fontSize="18px"
            top="0px !important"
            borderLeft="2px solid #aaa"
            color="white"
            borderTop="2px solid #aaa"
            width="4rem"
            height="4rem"
            borderRight="none"
            borderBottom="none"
            borderBottomEndRadius="0"
            borderTopStartRadius="0"
            borderTopEndRadius="0"
            border="0"
          />
        </ModalContent>
      </Modal>
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
        px={[8, 16]}
        pt={[10, 0]}
        pb={[5, 0]}
        width={['100%']}
        maxHeight={["30vh", "60vh", "70vh"]}
        height={["100%"]}
        justifyContent="center"
      >
        
        <TokenMedia
          key={`${token.address}-${token.id}`}
          config={system.config}
          {...token}
          metadata = {token?.metadata}
          maxW="100%"
          maxH="100%"
          objectFit="scale-down"
          cursor="pointer"
          onClick={onOpen}
        />
      </Flex>
      <Flex width="99vw" height="auto" justifyContent="flex-end" marginBottom={[3, 2]} zIndex="50">
        <Button onClick={onOpen}>
          <Maximize2 size={16} strokeWidth="3" />
        </Button>
      </Flex>
      <Flex width={['100%']} 
      // bg="white"
       flexDir="column" flexGrow={1}>
        <Flex align="center" justify="space-evenly" width={['100']} mt="4">
        </Flex>
        <Flex
          width={['90%', '90%', '70%']}
          mx="auto"
          flexDir="column"
          px={[4, 16]}
          flex="1"
        >
          <Flex
            flexDir="column"
            w="100%"
            // bg="white"
            py={6}
            mb={10}
            pos="relative"
          >
            <Heading textAlign="left" 
            // color="brand.black"
             width={["100%", "100%", "80%"]} fontSize={["10vw", "3vw"]} display="inline-block">
              {token.title}
            </Heading>
            <Text
              fontSize="md"
              // brand.neutralGray
              fontWeight="bold"
              mt={[2, 4]}
              width={['100%', '100%', '60%']}
            >
              {token.description || 'No description provided'}
            </Text>

            {
              (owner.length > 0)?
              owner.map((owner)=>{
                return(
                  <Flex key="ownerName" mt={[4, 8]}>
                    <Text color="secColDarkTheme">Owner :</Text>
                    <Text display="block" fontWeight="bold" ml={[1]} whiteSpace="nowrap" overflow="hidden" textOverflow="wrap">
                      <Link display="block" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" href={`/artistprofile/${owner.name.replaceAll(" ","")}`}>
                        {owner.name}
                        {/* <sup><img src={lk} alt="" width="auto" height="auto" style={{ display: 'inline-block' }} /></sup> */}
                      </Link>
                    </Text> 
                  </Flex>
                )
              })
              :
              <>
                <Flex key="ownerAddress" mt={[4, 8]}>
                <Text color="secColDarkTheme">Owner :</Text>
                <Text display="block" fontWeight="bold" ml={[1]} whiteSpace="nowrap" overflow="hidden" textOverflow="wrap">
                    {
                      (token.sale!==undefined)?token.sale.seller
                      :
                      (token.auction!==undefined)?token.auction.seller
                      :
                      token.owner
                    }
                </Text> 
                </Flex>
              </>
            }

            {
              (creator.length > 0)?
              creator.map((creator)=>{
                return( 
                  <Flex key="creatorName" mt={[4, 8]}>
                    <Text color="secColDarkTheme">Creator :</Text>
                    <Text display="block" fontWeight="bold" ml={[1]} whiteSpace="nowrap" overflow="hidden" textOverflow="wrap">
                    <Link display="block" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" href={`/artistprofile/${creator.name.replaceAll(" ","")}`}>
                        {creator.name}
                        {/* <sup><img src={lk} alt="" width="auto" height="auto" style={{ display: 'inline-block' }} /></sup> */}
                      </Link>
                    </Text>
                  </Flex>
                )
              })
              :(
                (token.metadata.minter!==undefined && token.metadata.minter!=='KT1Aq4wWmVanpQhq4TTfjZXB5AjFpx15iQMM')?
                <>
                <Flex key="creatorAddress" mt={[4, 8]}>
                <Text color="secColDarkTheme">Creator :</Text>
                  <Text display="block" fontWeight="bold" ml={[1]} whiteSpace="nowrap" overflow="hidden" textOverflow="wrap">
                        {token.metadata.minter}
                  </Text> 
                </Flex>
              </>
              : 
              <>
              <Flex key="creatorAddress" mt={[4, 8]}>
              <Text color="secColDarkTheme">Creator :</Text>
                  <Text display="block" fontWeight="bold" ml={[1]} whiteSpace="nowrap" overflow="hidden" textOverflow="wrap">
                        {token.metadata.creators && token.metadata.creators[0]}
                  </Text> 
                </Flex>
              </>
              )
            }

            {
              token?.metadata?.attributes?.map(({ name, value }) => {
              if(name === 'Artist' || name === '' || name === 'Royalty') return null;
              return(
                <Flex key={name + value} mt={[4, 8]}>
                  <Text color="secColDarkTheme">{name}:</Text>
                  <Text display="block" fontWeight="bold" ml={[1]} whiteSpace="nowrap" overflow="hidden" textOverflow="wrap">
                    {value}
                    {name === 'Royalty'?'%':''}
                  </Text>
                </Flex>
              )}
            )}

            {
              <Flex key="royalty" mt={[4, 8]}>
                <Text color="secColDarkTheme">Royalty :</Text>
                <Text display="block" fontWeight="bold" ml={[1]} whiteSpace="nowrap" overflow="hidden" textOverflow="wrap">
                  {royaltyPercentage}%
                </Text>
              </Flex>
            }
            {
              token.auction && (
                <>
                <Flex key="bid" mt={[4, 8]}>
                  <Text color="secColDarkTheme">Current Bid :</Text>
                  <Text display="block" fontWeight="bold" ml={[1]} whiteSpace="nowrap" overflow="hidden" textOverflow="wrap">
                    {token.auction.current_bid} tz
                  </Text>
                </Flex>
                <Flex key="bidder" mt={[4, 8]}>
                  <Text color="secColDarkTheme">Highest Bidder :</Text>
                  <Text display="block" fontWeight="bold" ml={[1]} whiteSpace="nowrap" overflow="hidden" textOverflow="wrap">
                    {token.auction.highest_bidder} 
                  </Text>
                </Flex>
                <Flex key="bid" mt={[4, 8]}>
                  <Text color="secColDarkTheme">Ends in :</Text>
                  <Text display="block" fontWeight="bold" ml={[1]} whiteSpace="nowrap" overflow="hidden" textOverflow="wrap">
                    <Timer expiryTimestamp = {new Date(token.auction.end_time)} />
                  </Text>
                </Flex>
                </>
              )
            }

            {
              <Flex key="metadata" mt={[4, 8]}>
                <Text color="secColDarkTheme"><i className="fas fa-link"></i></Text>
                <Text display="block" fontWeight="bold" ml={[1]} whiteSpace="nowrap" overflow="hidden" textOverflow="wrap">
                  <a href={getIPFSlink(token?.metadata?.artifactUri ?? '')} target="_blank" rel="noopener noreferrer">View on IPFS</a>
                </Text>
              </Flex>
            }

            {
              <Flex key="metadataIPFS" mt={[4, 8]}>
                <Text color="secColDarkTheme"><i className="fas fa-link"></i></Text>
                <Text display="block" fontWeight="bold" ml={[1]} whiteSpace="nowrap" overflow="hidden" textOverflow="wrap">
                  <a href={getIPFSlink(token?.metadata?.[''] ?? '')} target="_blank" rel="noopener noreferrer">View metadata</a>
                </Text>
              </Flex>
            }

            {/* Accordion can also be used to show information */}
            <Flex display={['flex']} justifyContent="space-between" alignItems="center" width="100%" flexDir={['column', 'row']} flexWrap="wrap" marginTop={2}>
              <Flex justifyContent={["flex-start"]} alignItems="center" width="100%" marginTop={4}>
              { token.sale ? (
                  isOwner ? (
                    <>
                      <Text color="brand.black" fontSize="xl" fontWeight="700" marginRight={8}>
                        {totalAmount} ꜩ
                      </Text>
                      <Box marginRight={8}>
                        <CancelTokenSaleButton
                          contract={token.sale.saleToken.address}
                          tokenId={token.sale.saleToken.tokenId}
                          saleId={token.sale.saleId}
                          saleType={token.sale.type}
                        />
                      </Box>
                    </>
                  ) : (
                    <>
                      <Text 
                      // color="black"
                       fontSize={['md', 'md', 'lg']} mr={1} fontWeight="700" marginRight={8}>
                        {totalAmount} ꜩ
                      </Text>
                      <Box>
                        <BuyTokenButton token={token} 
                          totalAmount={totalAmount} 
                          royalty={royaltyPercentage ?? 0} 
                          minter = {creatorAddress}
                        />
                      </Box>
                    </>
                  )
                ) :
                token.auction ? (
                  !isOwner ? (
                  <>
                    <Box marginRight={2}>
                      <BidTokenButton auctionId={token.auction.id} />
                    </Box>
                    { (Date.now() > (new Date(token.auction.end_time).getTime()))  ? (
                      <Box marginRight={2}>
                        <ResolveTokenAuctionButton id={token.auction.id} royalty = {royalty} minter = {token.metadata.minter ?? 'tz1iX91ZRN4KvFh3XrxGicr11ieeh5x3KDxP'} />
                      </Box> ) : <></>
                    }
                  </>
                  ) : (
                    <>
                      <CancelTokenAuctionButton id={token.auction.id} />
                    </>
                )) : 
                isOwner ? (
                  <>
                  <Box marginRight={2}>
                   <SellTokenButton token={token} contract={contractAddress} tokenId={tokenId} royaltyPercent = {royaltyPercentage ?? 0} />
                 </Box>
                  <Box marginRight={2}>
                    <ConfigureTokenButton token={token} contract={contractAddress} tokenId={tokenId} />
                  </Box>
                  <Box marginRight={2}>
                    <BurnTokenButton contractAddress={contractAddress} tokenId={tokenId} />
                  </Box>
                  </>
                ) : (
                  <></>
                )}
                {isOwner ? (
                  <Menu>
                    <MinterMenuButton variant="primary">
                      <MoreHorizontal color="#25282B" />
                    </MinterMenuButton>
                    <MenuList
                      borderColor="brand.lightBlue"
                      borderRadius="2px"
                      p={0}
                      minWidth={[100]}
                    >
                      {token.sale ? (
                        <></>
                      ) : (
                        <MinterMenuItem
                          w={[100]}
                          variant="primary"
                          onClick={disclosure.onOpen}
                        >
                          Transfer
                        </MinterMenuItem>
                      )}
                    </MenuList>
                    <TransferTokenModal
                      contractAddress={contractAddress}
                      tokenId={tokenId}
                      disclosure={disclosure}
                    />
                  </Menu>
                ) : (
                  <></>
                )}
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex >
  );
}

export default TokenDetail;
