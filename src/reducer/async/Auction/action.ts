import { createAsyncThunk } from '@reduxjs/toolkit';
import { State } from '../..';
import {
    configureAuction,
    bidAuction,
    resolveAuction,
    cancelAuction
} from '../../../lib/nfts/Auction/action';
import { ErrorKind, RejectValue } from '../errors';
import { notifyPending, notifyFulfilled } from '../../slices/notificationsActions';

// TODO : call auction contract address from config

type Options = {
    state: State;
    rejectValue: RejectValue;
};

export const configureTokenAction = createAsyncThunk<
    {openingPrice: number; minRaisePercent: number; minRaise: number; asset: any;},
    {openingPrice: number; minRaisePercent: number; minRaise: number; asset: any;},
    Options
>('action/configureToken', async (args, api) => {
    const { getState, rejectWithValue, dispatch, requestId } = api;
    const { openingPrice, minRaisePercent, minRaise, asset } = args;
    const { system } = getState();
    console.log("asset",asset);
    const auctionContract = "KT1LWwLzyxy3BvkEqNr2Lfe5xvk7geyNnZQt";
    if (system.status !== 'WalletConnected') {
        return rejectWithValue({
          kind: ErrorKind.WalletNotConnected,
          message: 'Could not transfer token: no wallet connected'
        });
    }
    try{
        const op = await configureAuction(system, auctionContract, openingPrice, minRaise, minRaisePercent, asset);

        dispatch(notifyPending(requestId, 'Configuring Auction ...'));
        await op.confirmation(2);

        dispatch(notifyFulfilled(requestId, 'Auction configured ...'));
        // get all auctions using dispatch here

        return args;
    } catch(e){
        return rejectWithValue({
            kind: ErrorKind.AuctionConfigureFailed,
            message: e.message  
        });
    }
});

export const bidTokenAction = createAsyncThunk<
    {auctionId: number; bidPrice: number;},
    {auctionId: number; bidPrice: number;},
    Options
>('action/bidToken', async (args, api) => {
    const { getState, rejectWithValue, dispatch, requestId } = api;
    const { auctionId, bidPrice } = args;
    const { system } = getState();
    const auctionContract = "KT1LWwLzyxy3BvkEqNr2Lfe5xvk7geyNnZQt";
    if (system.status !== 'WalletConnected') {
        return rejectWithValue({
          kind: ErrorKind.WalletNotConnected,
          message: 'Could not transfer token: no wallet connected'
        });
    }
    try{
        const op = await bidAuction(system, auctionContract, auctionId, bidPrice);

        dispatch(notifyPending(requestId, 'Bidding ...'));
        await op.confirmation(2);

        dispatch(notifyFulfilled(requestId, 'Bid placed ...'));
        // get all auctions using dispatch here

        return args;
    } catch(e){
        return rejectWithValue({
            kind: ErrorKind.BidTokenFailed,
            message: e.message  
        });
    }
});

export const resolveTokenAction = createAsyncThunk<
    {auctionId: number;},
    {auctionId: number;},
    Options
>('action/resolveToken', async (args, api) => {
    const { getState, rejectWithValue, dispatch, requestId } = api;
    const { auctionId } = args;
    const { system } = getState();
    const auctionContract = "KT1LWwLzyxy3BvkEqNr2Lfe5xvk7geyNnZQt";
    if (system.status !== 'WalletConnected') {
        return rejectWithValue({
          kind: ErrorKind.WalletNotConnected,
          message: 'Could not transfer token: no wallet connected'
        });
    }
    try{
        const op = await resolveAuction(system, auctionContract, auctionId);

        dispatch(notifyPending(requestId, 'Resolving Auction ...'));
        await op.confirmation(2);

        dispatch(notifyFulfilled(requestId, 'Auction resolved ...'));
        // get all auctions using dispatch here

        return args;
    } catch(e){
        return rejectWithValue({
            kind: ErrorKind.ResolveTokenFailed,
            message: e.message  
        });
    }
});

export const cancelTokenAction = createAsyncThunk<
    {auctionId: number;},
    {auctionId: number;},
    Options
>('action/cancelTokenAuction', async (args, api) => {
    const { getState, rejectWithValue, dispatch, requestId } = api;
    const { auctionId } = args;
    const { system } = getState();
    const auctionContract = "KT1LWwLzyxy3BvkEqNr2Lfe5xvk7geyNnZQt";
    if (system.status !== 'WalletConnected') {
        return rejectWithValue({
          kind: ErrorKind.WalletNotConnected,
          message: 'Could not transfer token: no wallet connected'
        });
    }
    try{
        const op = await cancelAuction(system, auctionContract, auctionId);

        dispatch(notifyPending(requestId, 'Cancelling Auction ...'));
        await op.confirmation(2);

        dispatch(notifyFulfilled(requestId, 'Auction cancelled ...'));
        // get all auctions using dispatch here

        return args;
    } catch(e){
        return rejectWithValue({
            kind: ErrorKind.CancelTokenSaleFailed,
            message: e.message  
        });
    }
});