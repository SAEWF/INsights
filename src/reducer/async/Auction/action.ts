import { createAsyncThunk } from '@reduxjs/toolkit';
import { State } from '../..';
import {
    configureAuction,
    bidAuction,
    resolveAuction,
    cancelAuction
} from '../../../lib/nfts/Auction/action';
import AddAuctionDataToFirebase from '../../../components/Artist/AddAuctionDataToFirebase';
import { Nft } from '../../../lib/nfts/decoders';
import { ErrorKind, RejectValue } from '../errors';
import { notifyPending, notifyFulfilled } from '../../slices/notificationsActions';
import UpdateSoldnCollectedTokenInFB from '../../../components/Artist/UpdateSoldnCollectedTokenInFB';

// TODO : call auction contract address from config

type Options = {
    state: State;
    rejectValue: RejectValue;
};

export const configureTokenAction = createAsyncThunk<
    {token: Nft, openingPrice: number; minRaisePercent: number; minRaise: number; asset: any;},
    {token: Nft, openingPrice: number; minRaisePercent: number; minRaise: number; asset: any;},
    Options
>('action/configureToken', async (args, api) => {
    const { getState, rejectWithValue, dispatch, requestId } = api;
    const { token, openingPrice, minRaisePercent, minRaise, asset } = args;
    const { system } = getState();
    const auctionContract = "KT1QX2BKn9tDk2XAQAGzRemcWjF3q5yNPH8Y";
    if (system.status !== 'WalletConnected') {
        return rejectWithValue({
          kind: ErrorKind.WalletNotConnected,
          message: 'Could not transfer token: no wallet connected'
        });
    }
    try{
        const op = await configureAuction(system, auctionContract, openingPrice, minRaise, minRaisePercent, asset);

        dispatch(notifyPending(requestId, 'Configuring Auction ...'));
        // await AddAuctionDataToFirebase(token, asset[0].fa2_address, system.wallet, asset[0].fa2_batch[0].token_id, openingPrice, asset[0].fa2_address);
        // await op.confirmation();
        try{ await op.confirmation(2); }catch{ try{ await op.confirmation(); }catch{try{ await op.confirmation(); }catch{ } }}
        

        dispatch(notifyFulfilled(requestId, 'Auction configured ...'));
        // get all auctions using dispatch here

        return args;
    } catch(e){
        console.log("Create Auction - ", e);
        // return rejectWithValue({
        //     kind: ErrorKind.AuctionConfigureFailed,
        //     message: 'Failed '  
        // });
        return args;
    }
});

export const bidTokenAction = createAsyncThunk<
    {token: Nft, auctionId: number; bidPrice: number;},
    {token: Nft, auctionId: number; bidPrice: number;},
    Options
>('action/bidToken', async (args, api) => {
    const { getState, rejectWithValue, dispatch, requestId } = api;
    const { token, auctionId, bidPrice } = args;
    const { system } = getState();
    const auctionContract = "KT1QX2BKn9tDk2XAQAGzRemcWjF3q5yNPH8Y";
    if (system.status !== 'WalletConnected') {
        return rejectWithValue({
          kind: ErrorKind.WalletNotConnected,
          message: 'Could not transfer token: no wallet connected'
        });
    }
    try{
        const op = await bidAuction(system, auctionContract, auctionId, bidPrice);

        dispatch(notifyPending(requestId, 'Bidding ...'));
        await AddAuctionDataToFirebase(token, token.address, system.wallet, token.id, bidPrice, token.address);
        try{ await op.confirmation();}catch(e)
        {
            try{await op.confirmation();}catch{}
            console.log("Bidding auction error - ", e);
        }

        dispatch(notifyFulfilled(requestId, 'Bid placed ...'));
        // get all auctions using dispatch here

        return args;
    } catch(e){
        return rejectWithValue({
            kind: ErrorKind.BidTokenFailed,
            message: 'Failed '  
        });
    }
});

export const resolveTokenAction = createAsyncThunk<
    {token: Nft, auctionId: number; royalty: number; minter: string, sold: Boolean},
    {token: Nft, auctionId: number; royalty: number; minter: string, sold: Boolean},
    Options
>('action/resolveToken', async (args, api) => {
    const { getState, rejectWithValue, dispatch, requestId } = api;
    const { token, auctionId, royalty, minter, sold } = args;
    const { system } = getState();

    // TODO : take from config file 
    const auctionContract = "KT1QX2BKn9tDk2XAQAGzRemcWjF3q5yNPH8Y";
    if (system.status !== 'WalletConnected') {
        return rejectWithValue({
          kind: ErrorKind.WalletNotConnected,
          message: 'Could not transfer token: no wallet connected'
        });
    }
    try{
        const op = await resolveAuction(system, auctionContract, auctionId, royalty, minter, sold);
        await UpdateSoldnCollectedTokenInFB(system.tzPublicKey, token.owner ,token.id, token.address, token);

        dispatch(notifyPending(requestId, 'Resolving Auction ...'));
        
        try{ await op.confirmation(2); }catch(e)
        {
            try{ await op.confirmation(); }catch{try{ await op.confirmation(); }catch{ }}
            console.log("Creating auction error - ", e);
        }

        dispatch(notifyFulfilled(requestId, 'Auction resolved ...'));
        // get all auctions using dispatch here

        return args;
    } catch(e){
        return rejectWithValue({
            kind: ErrorKind.ResolveTokenFailed,
            message: 'Failed '  
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
    const auctionContract = "KT1QX2BKn9tDk2XAQAGzRemcWjF3q5yNPH8Y";
    if (system.status !== 'WalletConnected') {
        return rejectWithValue({
          kind: ErrorKind.WalletNotConnected,
          message: 'Could not transfer token: no wallet connected'
        });
    }
    try{
        const op = await cancelAuction(system, auctionContract, auctionId);

        dispatch(notifyPending(requestId, 'Cancelling Auction ...'));
        try{ await op.confirmation(2); }catch(e)
        {
            try{ await op.confirmation(); }catch{try{ await op.confirmation(); }catch{ } }
            console.log("Cancelling auction error - ", e);
        }
        

        dispatch(notifyFulfilled(requestId, 'Auction cancelled ...'));
        // get all auctions using dispatch here

        return args;
    } catch(e){
        console.log("Cancel Auction - ", e);
        return rejectWithValue({
            kind: ErrorKind.CancelTokenSaleFailed,
            message: 'Failed '  
        });
    }
});