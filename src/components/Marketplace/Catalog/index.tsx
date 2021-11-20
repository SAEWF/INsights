import React, { useEffect, useState } from 'react';
import { Text, Flex, Heading, Spinner, SimpleGrid, Box, Select } from '@chakra-ui/react'; //
import { Wind } from 'react-feather';
import { useSelector, useDispatch } from '../../../reducer';
import {
  getMarketplaceNftsQuery,
  loadMoreMarketplaceNftsQuery,
  refreshMarketplaceNftsQuery
} from '../../../reducer/async/queries'; //

import TokenCard from './TokenCard';
import FeaturedToken from './FeaturedToken';
import '../index.css'
// import { VisibilityTrigger } from '../../common/VisibilityTrigger';
// import StaticMarketplaceDisplay from './StaticMarketplaceDisplay'
import { Pagination } from 'react-bootstrap'

export default function Catalog() {
  const { system, marketplace: state } = useSelector(s => s);
  const dispatch = useDispatch();
  const [active, setActive] = useState(1);
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(9);
  const [reverse, setReverse] = useState(1);

  // blackList for wallet address 
  // it will block display of minted nfts from them 
    const blackList = ['tz1ZvsgNBPsvqZcqhNuYnHrH5k8LwDbPQzWF',
      'tz1brJrpAVdmrNAzRNLrDsrRRY1K98mSTR6z',
      'tz1VSZaQdqQwWcqdLiJnQwPJkushYVq51PSX',
      'tz1hcWL5pwX65X1kfNTEL3uuAbkXDpUoURRH',
      'tz1WiopX436BPwi4maDbbBDuzYgdtTTuKDAK'];
      
    useEffect(() => {
        dispatch(refreshMarketplaceNftsQuery());
        dispatch(getMarketplaceNftsQuery({address: state.marketplace.address, reverse: reverse}));
    }, [state.marketplace.address, dispatch, reverse]);

    const loadMore = (pageNumber: number) => {
      dispatch(loadMoreMarketplaceNftsQuery({page:pageNumber}));
    };

    useEffect(() => {
      loadMoreMarketplaceNftsQuery({page: active});
    }, [active]);

    // console.log('marketplace tokens', state.marketplace.tokens);
    let tokens = state.marketplace.tokens?.filter(x => x.token).map(x => x.token!) ?? [];
    tokens = tokens.filter(x => !blackList.includes(x.metadata?.minter ?? ''));

    // for getting all tokens sale data , uncomment below line
    // console.log('tokens', tokens);
    // for getting all tokenData from marketplace , change a bit in the getMarketplaceNftsQuery dispatcher

    // PAGINATION
    let items = [];
    const numberOfPages = Math.ceil(tokens.length-1 / 8);
    for (let number = 1; number <= numberOfPages; number++) {
      items.push(
        <Pagination.Item key={number} active={number === active} onClick={()=>{
          setActive(number);
          setStart((number-1)*8 + 1);
          setEnd(Math.min(state.marketplace.tokens?.length ?? 0, number*8)+1);
          console.log('start', (number-1)*8 + 1, 'end', end);
          loadMore(number);
        }}>
          {number}
        </Pagination.Item>
      );
    }

    const handleFirst = () =>{
      setActive(1);
      setStart(1);
      setEnd(9);
      loadMore(1);
    }
    const handlePrev = () =>{
      if(active > 1){
        setActive(active-1);
        setStart(start-8);
        setEnd(end-8);
        loadMore(active-1);
      }
    }
    const handleNext = () =>{
      if(active < numberOfPages){
        setActive(active+1);
        setStart(start+8);
        setEnd(end+8);
        loadMore(active+1);
      }
    }
    const handleLast = () =>{
      setActive(numberOfPages);
      setStart((numberOfPages-1)*8 + 1);
      setEnd(state.marketplace.tokens?.length ?? 0);
      loadMore(numberOfPages);
    }

    const paginationBasic = (
      <Pagination>
          <Pagination.First onClick ={()=>setActive(1)} />
          <Pagination.Prev onClick={()=>{if(active>1) setActive(active-1)}} />
            {items}
          <Pagination.Next onClick={()=>{if(active<numberOfPages) setActive(active+1)}}/>
          <Pagination.Last onClick={()=>{setActive(numberOfPages)}}/>
      </Pagination>
    )

    const PaginationWithEllipses = (
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
    )
    
    const handleChange = (e: any) =>{
      setReverse(e.target.value);
    }

    return (
    <>
      <Flex
        w="100vw"
        h="100%"
        px={10}
        pt={6}
        overflowY="scroll"
        justify="start"
        flexDir="column"
      >
        <div className="sortSelect" style={{ marginRight: '0px', marginLeft: 'auto', display: 'flex', position: 'sticky'}}>
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

        {/* FeaturedToken  */}
        {state.marketplace.loaded && tokens.length > 0 ? (
          // <Flex width="calc(100vw - 5rem)" justifyContent="center" alignItems="center">
          <FeaturedToken config={system.config} {...tokens[0]} />
          // </Flex>
        ) : null}
        {/* FeaturedToken end */}

        <Flex
          flex="1"
          w="100%"
          flexDir="column"
        >
          {!state.marketplace.loaded ? (
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
                  No tokens to display in this marketplace
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
                  {state.marketplace.tokens?.slice(start, end).map(tokenDetail => {
                    const token = tokenDetail.token;
                    if(token && token.metadata?.minter!==undefined && !blackList.includes(token.metadata?.minter))
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
                  })}
                  {/* <VisibilityTrigger
                    key={state.marketplace.tokens?.length + ':' + tokens.length}
                    onVisible={()=>loadMore(active)}
                    allowedDistanceToViewport={600}
                  /> */}
                </>
                {/* <StaticMarketplaceDisplay /> */}

              </SimpleGrid>
              {
                (state.marketplace.tokens?.length ?? 0) < 8 ? 
                  paginationBasic
                  :
                  PaginationWithEllipses
              }
            </>
          )}
        </Flex>
      </Flex>
    </>
  );
}