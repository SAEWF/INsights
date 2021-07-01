import React, { useEffect } from 'react';
import { SimpleGrid, Box, } from '@chakra-ui/react'; //
import { useSelector, useDispatch } from '../../reducer';
import {
  getMarketplaceNftsQuery,
  loadMoreMarketplaceNftsQuery
} from '../../reducer/async/queries'; 
import TokenCard from '../Marketplace/Catalog/TokenCard';
import { VisibilityTrigger } from '../common/VisibilityTrigger';

export default function ArtistProfileCard(props:PropsType) {
  const { system, marketplace: state } = useSelector(s => s);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMarketplaceNftsQuery(state.marketplace.address));
  }, [state.marketplace.address, dispatch]);

  const loadMore = () => {
    dispatch(loadMoreMarketplaceNftsQuery({}));
  };

  let tokens =
    state.marketplace.tokens?.filter(x => x.token).map(x => x.token!) ?? [];
    // console.log("tokens")
    // console.log(tokens)
    // console.log("props")
    // console.log(props.artTokens)

    var artistTokens: any;
    artistTokens = props.artTokens;
    
    // console.log("props ArtistProfileCard")
    // console.log(props.artTokens)
    // console.log("artistTokens")
    // console.log(artistTokens)
    const keys = Object.keys(artistTokens);
    // console.log(keys);
    var allTokensList:any[]=[];
    keys.forEach((key, index) => {
      allTokensList.push(artistTokens[key])
      // console.log(`${key}: ${artistTokens[key]}`);
    });
    // console.log("allTokensList")
    // console.log(allTokensList)

  return (
    <>
    <SimpleGrid
        columns={{ sm: 1, md: 2, lg: 3, xl: 3 }}
        gap={2}
        pb={8}>
        <>
         {// eslint-disable-next-line 
         tokens.map(token => {
            for(var i = 0;i<allTokensList.length;i++){
              if(token.id===(allTokensList[i])){
                return (
                  <Box display="grid" transition="250ms padding" padding={1} _hover={{ padding: 0 }} mb={7}>
                  <TokenCard
                    key={`${token.address}-${token.id}`}
                    config={system.config}
                    {...token}
                  />
                </Box>
                );
                }
              };
         })}
            <VisibilityTrigger
            key={state.marketplace.tokens?.length + ':' + tokens.length}
            onVisible={loadMore}
            allowedDistanceToViewport={600}
            />
            </>
        </SimpleGrid>

    </>
  );
}


interface PropsType {
    artTokens: string
  };