import React, { useEffect } from 'react';
import { Box, } from '@chakra-ui/react'; 
import { Col,} from 'react-bootstrap';

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
    dispatch(getMarketplaceNftsQuery({address: state.marketplace.address, reverse: 1}));  
  }, [state.marketplace.address, dispatch]);

  const loadMore = () => {
    dispatch(loadMoreMarketplaceNftsQuery({page: 0}));
  };

  let tokens =
    state.marketplace.tokens?.filter(x => x.token).map(x => x.token!) ?? [];
    // console.log("tokens")
    // console.log(tokens)

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
         {// eslint-disable-next-line 
         tokens.map(token => {
            for(var i = 0;i<allTokensList.length;i++){
              if(token.id===(allTokensList[i])){
                return (
                  <Col >
                    <Box display="grid" transition="250ms padding" padding={1} _hover={{ padding: 0 }} mb={7}>
                    <TokenCard
                      key={`${token.address}-${token.id}`}
                      config={system.config}
                      {...token}
                    />
                  </Box>
                </Col>

                );
                }
              };
         })}

          <div style={{ display: "none" }}>
            <VisibilityTrigger
            key={state.marketplace.tokens?.length + ':' + tokens.length}
            onVisible={loadMore}
            allowedDistanceToViewport={600}
            />
        </div>

    </>
  );
}


interface PropsType {
    artTokens: string
  };