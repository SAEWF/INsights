import { createSlice, PayloadAction, CaseReducer } from '@reduxjs/toolkit';
import {
  getAuctionNftsQuery,
  loadMoreAuctionNftsQuery,
  refreshAuctionNftsQuery
} from '../async/Auction/queries';
import { Nft } from '../../lib/nfts/decoders';
import { AuctionNftLoadingData } from '../../lib/nfts/Auction/queries';
import config from '../../config.json';

//// State

// Types

export type Token = Nft;

export interface Auction {
  address: string;
  tokens: AuctionNftLoadingData[] | null;
  loaded: boolean;
}

export interface AuctionState {
  auction: Auction;
}

type Reducer<A> = CaseReducer<AuctionState, PayloadAction<A>>;

// Data

const globalAuctionAddress = config.contracts.auction;

export const initialState: AuctionState = {
  auction: {
    address: globalAuctionAddress,
    tokens: null,
    loaded: false
  }
};

//// Reducers & Slice

type PopulateAuction = Reducer<{ tokens: AuctionNftLoadingData[] }>;
type RefreshAuction = Reducer<{ tokens: AuctionNftLoadingData[] }>;

const populateAuctionR: PopulateAuction = (state, { payload }) => {
  state.auction.tokens = payload.tokens;
  state.auction.loaded = true;
};

const refreshAuctionR: RefreshAuction = (state, {payload}) => {
  state.auction.tokens = payload.tokens;
  state.auction.loaded = false;
};

const slice = createSlice({
  name: 'marketplace',
  initialState,
  reducers: {
    populateAuction: populateAuctionR,
    refreshAuction: refreshAuctionR
  },
  extraReducers: ({ addCase }) => {
    addCase(getAuctionNftsQuery.fulfilled, populateAuctionR);
    addCase(loadMoreAuctionNftsQuery.fulfilled, populateAuctionR);
    addCase(refreshAuctionNftsQuery.fulfilled, refreshAuctionR);
  }
});

export const { populateAuction, refreshAuction } = slice.actions;

export default slice;
