import React, { useEffect } from 'react';
import { Switch, Route, useLocation } from 'wouter';
import CreateNonFungiblePage from '../CreateNonFungiblePage';
import CollectionsCatalog from '../Collections/Catalog';
import CollectionDisplay from '../Collections/Catalog/CollectionDisplay';
import CollectionsTokenDetail from '../Collections/TokenDetail';
import MarketplaceCatalog from '../Marketplace/Catalog';
import Header from '../common/Header';
import { Flex } from '@chakra-ui/react';
import Notifications from '../common/Notifications';
import { useSelector, useDispatch } from '../../reducer';
import { reconnectWallet } from '../../reducer/async/wallet';
import Creator from '../Creator';
// import { getMarketplaceNftsQuery } from '../../reducer/async/queries';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '../common/Footer';
import AlertBar from '../common/AlertBar';
import ArtistList from '../Artist/ArtistList';
import ArtistProfile from '../Artist/ArtistProfile';
import Registration from '../common/Registration';
import Terms from '../common/Terms';

export default function App() {
  const dispatch = useDispatch();
  const state = useSelector(s => s);

  let walletReconnectAttempted = state.system.walletReconnectAttempted;

  //alert to show only on root
  const [location] = useLocation();
  var showAlert = false;
  if (location === '/') {
    showAlert = true;
  }

  // // This causes excessive resource consumption as *all* marketplace data
  // // loads when the app is mounted, even if the user has not landed or will
  // // not land on the `/marketplace` view
  //
  // useEffect(() => {
  //   dispatch(getMarketplaceNftsQuery(state.marketplace.marketplace.address));
  // }, [state.marketplace.marketplace.address, dispatch]);

  useEffect(() => {
    if (!walletReconnectAttempted) {
      dispatch(reconnectWallet());
    }
  }, [walletReconnectAttempted, dispatch]);

  return (
    <Flex pos="absolute" w="100%" h="100%">
      <Flex justifyContent="space-between" width="100%" flexDir="column">
        {showAlert ? <AlertBar /> : null}
        <Header />
        <Switch>
          <Route path="/">
            <>
              <MarketplaceCatalog />
              <Footer />
            </>
          </Route>
          <Route path="/create">
            <>
              <CreateNonFungiblePage />
            </>
          </Route>
          <Route path="/collections">
            <>
              <CollectionsCatalog />
            </>
          </Route>
          <Route path="/register">
            <>
              <Registration />
            </>
          </Route>
          <Route path="/marketplace">
            <MarketplaceCatalog />
          </Route>
          <Route path="/creator/:minter">
            {({ minter }) => <Creator minter={minter} />}
          </Route>
          <Route path="/collection/:contractAddress">
            {({ contractAddress }) => (
              <CollectionDisplay address={contractAddress} ownedOnly={false} />
            )}
          </Route>
          <Route path="/collection/:contractAddress/token/:tokenId">
            {({ contractAddress, tokenId }) => (
              <CollectionsTokenDetail
                key={contractAddress + tokenId}
                contractAddress={contractAddress}
                tokenId={parseInt(tokenId)}
              />
            )}
          </Route>
          <Route path="/artists">
            <ArtistList />
          </Route>
          <Route path="/legal/tnc">
            <Terms />
          </Route>
          <Route path="/artistprofile/:username">
            {({ username }) => (
              <ArtistProfile username={username} />
            )}
          </Route>
         
        </Switch>
        <Notifications />
      </Flex>
    </Flex >
  );
}
