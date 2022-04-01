import React, { useEffect, useState } from 'react';
import { Text, Flex, Heading, Spinner, SimpleGrid, Box, Select, useColorModeValue, Center, Image, Link } from '@chakra-ui/react'; //
import { Wind } from 'react-feather';
import { useSelector, useDispatch } from '../../../reducer';
import Banner from './Banner';
import TokenCard from './TokenCard';
import '../index.css'
import logo from '../../common/assets/splash-logo.svg';
import { Pagination } from 'react-bootstrap'
import Footer from '../../common/Footer';
import { getAuctionNftsQuery, loadMoreAuctionNftsQuery, refreshAuctionNftsQuery } from '../../../reducer/async/Auction/queries';
import { connectWallet  } from '../../../reducer/async/wallet';
import { MinterButton } from '../../common';


export default function Catalog(props:any) {
  const { system, auction: state } = useSelector(s => s);
  const dispatch = useDispatch();
  const [active, setActive] = useState(1);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(16);
  const [reverse, setReverse] = useState(1);
  // const [, setLocation] = useLocation();
  const bg = useColorModeValue('gray.100', 'black');

  // blackList for wallet address 
  // it will block display of minted nfts from them 
    const blackList = ['tz1ZvsgNBPsvqZcqhNuYnHrH5k8LwDbPQzWF',
      'tz1brJrpAVdmrNAzRNLrDsrRRY1K98mSTR6z',
      'tz1VSZaQdqQwWcqdLiJnQwPJkushYVq51PSX',
      'tz1hcWL5pwX65X1kfNTEL3uuAbkXDpUoURRH',
      'tz1WiopX436BPwi4maDbbBDuzYgdtTTuKDAK'];

      // TODO : blacklist removal ....
      
    useEffect(() => {
        dispatch(refreshAuctionNftsQuery());
        dispatch(getAuctionNftsQuery({address: state.auction.address
          , reverse: reverse
        }));
    }, [state.auction.address, dispatch, reverse]);

    const loadMore = (pageNumber: number) => {
      dispatch(loadMoreAuctionNftsQuery({page:pageNumber}));
    };

    useEffect(() => {
      loadMoreAuctionNftsQuery({page: active});
    }, [active]);

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
            
          </Flex>
        </Flex>
      );
    }

    // console.log('auction tokens', state.auction.tokens);
    let tokens = state.auction.tokens?.filter(x => x.token).map(x => x.token!) ?? [];
    tokens = tokens.filter(x => !blackList.includes(x.metadata?.minter ?? ''));

    console.log("All tokens - ", tokens);

    // for getting all tokens sale data , uncomment below line
    // console.log('tokens', state.auction.tokens);
    // for getting all tokenData from auction , change a bit in the getauctionNftsQuery dispatcher

    // PAGINATION
    let items = [];
    const numberOfPages = Math.ceil(tokens.length-1 / 16);
    for (let number = 1; number <= numberOfPages; number++) {
      items.push(
        <Pagination.Item key={number} active={number === active} onClick={()=>{
          setActive(number);
          setStart((number-1)*16);
          setEnd(Math.min(state.auction.tokens?.length ?? 0, number*16));
          loadMore(number);
        }}>
          {number}
        </Pagination.Item>
      );
    }

    const handleFirst = () =>{
      setActive(1);
      setStart(0);
      setEnd(16);
      loadMore(1);
    }
    const handlePrev = () =>{
      if(active > 1){
        setActive(active-1);
        setStart(start-16);
        setEnd(end-16);
        loadMore(active-1);
      }
    }
    const handleNext = () =>{
      if(active < numberOfPages){
        setActive(active+1);
        setStart(start+16);
        setEnd(end+16);
        loadMore(active+1);
      }
    }
    const handleLast = () =>{
      setActive(numberOfPages);
      setStart((numberOfPages-1)*16 + 1);
      setEnd(state.auction.tokens?.length ?? 0);
      loadMore(numberOfPages);
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
    
    const handleChange = (e: any) =>{
      setReverse(e.target.value);
    }

    return (
    <>
    <div>
      <Flex
        w="100vw"
        h="100%"
        px={10}
        pt={6}
        overflowY="scroll"
        justify="start"
        flexDir="column"
      >
        {
          (props.hideBanner===undefined) && (!props.hideBanner) ? (<div className="text-center banner" ><Banner/> </div>) : <></>
        }
        <Center><Heading>Auction to be resolved</Heading></Center>
        <div className="sortSelect" style={{ marginRight: '0px', marginLeft: 'auto', display: 'flex',justifyContent: 'space-between' , justifySelf: 'end'}}>
          <Select
            bg="#00ffbe"
            borderColor="#00ffbe"
            color="black"
            onChange={handleChange}
          >
            <option style={{color:'white', backgroundColor: 'black', borderColor: 'cyan'}} key="1" value={1} defaultChecked={true}>Newest</option>
            <option style={{color:'white', backgroundColor: 'black'}} color="white" key="2" value={2}>Oldest</option>
            <option style={{color:'white', backgroundColor: 'black'}} key="3" value={3}>Price : Low to High</option>
            <option style={{color:'white', backgroundColor: 'black'}} key="4" value={4}>Price : High to Low</option>
          </Select>
        </div>
        <div>
        <Flex
          flex="1"
          w="100%"
          flexDir="column"
        >
          {!state.auction.loaded ? (
            <Flex flexDir="column" align="center" flex="1" pt={20}>
              <Spinner size="xl" mb={6} color="gray.300" />
              <Heading size="lg" textAlign="center" color="gray.500">
                Loading...
              </Heading>
            </Flex>
          ) : tokens.length === 0 ? (
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
                  No tokens to display in this auction
                </Text>
              </Flex>
            </Flex>
          ) : (
            <>
              <SimpleGrid
                columns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
                gap={2}
                pb={8}
              >
                <>
                  {state.auction.tokens?.slice(start, end).map(tokenDetail => {
                    const token = tokenDetail.token;
                    if(token && token.metadata?.minter!==undefined && blackList.includes(token.metadata?.minter)) return <></>;
                    else if(token){
                      console.log("token == ", token);
                      let highestBidder = token.auction?.highest_bidder;
                      let seller = token.auction?.seller;
                      let end_time:any = token.auction?.end_time;
                      let isOver = (Date.now() > (new Date(end_time).getTime()));
                      let current_user = system.tzPublicKey;

                      console.log("current user = ", current_user);

                      if( isOver && ( (current_user === highestBidder) || (current_user === seller) ))
                      return (
                        <Box display="grid" transition="250ms padding" padding={1} style={{transition: 'all .2s ease-in-out'}} _hover={{ transform: 'scale(1.05)' }} mb={7}>
                          <TokenCard
                            key={`${token.address}-${token.id}`}
                            config={system.config}
                            {...token}
                          />
                        </Box>
                      );
                      else return <></>;
                    }
                    
                    else return <></>;
                  })}
                </>

              </SimpleGrid>
              {
                (state.auction.tokens?.length ?? 0) < 16 ? 
                  <></>
                  :
                  PaginationWithEllipses
              }
            </>
          )}
        </Flex>
        </div>
      </Flex>
      </div>
      <div>
        { (props.hideFooter === undefined) && (!props.hideFooter) ? (<Footer/>) : <></>}
        {/* <Footer/> */}
      </div>
    </>
  );
}