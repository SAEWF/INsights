/* eslint-disable no-redeclare */
import { Buffer } from 'buffer';
import * as t from 'io-ts';
import _ from 'lodash';
import { SystemWithToolkit, SystemWithWallet } from '../system';
import { TzKt, Params } from '../service/tzkt';
import { isLeft } from 'fp-ts/lib/Either';
import { compact } from 'fp-ts/lib/Array';
import { getRight } from 'fp-ts/lib/Option';
import * as D from './decoders';

import {
  getLedgerBigMapCustom, 
  getTokenMetadataBigMapCustom, 
  getOwnedLedgerBigMapCustom, 
  getOwnedTokenMetadataBigMapCustom, 
  getLedgerBigMapCustomWithKey, 
  getTokenMetadataBigMapCustomWithKey,
  getContractFromFirebase
 } from './actionCustom';

function fromHexString(input: string) {
  if (/^([A-Fa-f0-9]{2})*$/.test(input)) {
    return Buffer.from(input, 'hex').toString();
  }
  return input;
}

//// Data retrieval and decoding functions

async function getAssetMetadataBigMap(
  tzkt: TzKt,
  address: string
): Promise<D.AssetMetadataBigMap> {
  const path = 'metadata';
  const data = await tzkt.getContractBigMapKeys(address, path);
  const decoded = D.LedgerBigMap.decode(data);
  if (isLeft(decoded)) {
    throw Error('Failed to decode `getAssetMetadata` response');
  }
  return decoded.right;
}

async function getLedgerBigMap(
  tzkt: TzKt,
  address: string
): Promise<D.LedgerBigMap> {
  const path = 'assets.ledger';
  const params = {
    'sort.desc': 'id'
  };
  const data = await tzkt.getContractBigMapKeys(address, path, params);
  // console.log("DATA",data);
  const decoded = D.LedgerBigMap.decode(data);
  if (isLeft(decoded)) {
    // throw Error('Failed to decode `getLedger` response');
    return data;
  }
  return decoded.right;
}

async function getOwnedLedgerBigMap(
  tzkt: TzKt,
  address: string,
  walletID: string
): Promise<D.LedgerBigMap> {
  const path = 'assets.ledger';
  const params = {
    'value': walletID
  }
  const data = await tzkt.getContractBigMapKeys(address, path, params);
  const decoded = D.LedgerBigMap.decode(data);
  if (isLeft(decoded)) {
    throw Error('Failed to decode `getLedger` response');
  }
  return decoded.right;
}

async function getLedgerBigMapWithKey(
  tzkt: TzKt,
  address: string,
  key: string
): Promise<D.LedgerBigMap> {
  const path = 'assets.ledger';
  const params = {
    key: key
  };
  const data = await tzkt.getContractBigMapKeys(address, path, params);
  const decoded = D.LedgerBigMap.decode(data);
  if (isLeft(decoded)) {
    throw Error('Failed to decode `getLedger` response');
  }
  return decoded.right;
}

async function getTokenMetadataBigMap(
  tzkt: TzKt,
  address: string
): Promise<D.TokenMetadataBigMap> {
  const path = 'assets.token_metadata';
  const params = {
    'sort.desc': 'id'
  }
  const data = await tzkt.getContractBigMapKeys(address, path, params);
  const decoded = D.TokenMetadataBigMap.decode(data);
  if (isLeft(decoded)) {
    throw Error('Failed to decode `getTokenMetadata` response');
  }
  return decoded.right;
}

async function getOwnedTokenMetadataBigMap(
  tzkt: TzKt,
  address: string,
  keys: string[]
): Promise<D.TokenMetadataBigMap> {
  const path = 'token_metadata';
  const data = await Promise.all(
    keys.map(async (key) => {
      const params = {
        'key': key
      }
      const data = await tzkt.getContractBigMapKeys(address, path, params);
      return data[0];
    })
  );
  //console.log("DATA",data);
  const decoded = D.TokenMetadataBigMap.decode(data);
  if (isLeft(decoded)) {
    throw Error('Failed to decode `getTokenMetadata` response');
  }
  return decoded.right;
}


async function getTokenMetadataBigMapWithKey(
  tzkt: TzKt,
  address: string,
  key: string
): Promise<D.TokenMetadataBigMap> {
  const path = 'assets.token_metadata';
  const params = {
    key: key
  }
  const data = await tzkt.getContractBigMapKeys(address, path, params);
  const decoded = D.TokenMetadataBigMap.decode(data);
  if (isLeft(decoded)) {
    throw Error('Failed to decode `getTokenMetadata` response');
  }
  return decoded.right;
}

async function getFixedPriceSalesBigMap(
  tzkt: TzKt,
  address: string
): Promise<D.FixedPriceSaleBigMap> {
  const fixedPriceStorage = D.FixedPriceSaleStorage.decode(
    await tzkt.getContractStorage(address)
  );
  if (isLeft(fixedPriceStorage)) {
    throw Error('Failed to decode `getFixedPriceSales` bigMap ID');
  }
  const fixedPriceBigMapId = fixedPriceStorage.right.sales;
  const fixedPriceSales = await tzkt.getBigMapKeys(fixedPriceBigMapId);
  const decoded = D.FixedPriceSaleBigMap.decode(fixedPriceSales);
  if (isLeft(decoded)) {
    throw Error('Failed to decode `getFixedPriceSales` response');
  }
  return decoded.right;
}

async function getFixedPriceSalesBigMapBySeller(
  tzkt: TzKt,
  address: string,
  seller: string
): Promise<D.FixedPriceSaleBigMap> {
  const fixedPriceStorage = D.FixedPriceSaleStorage.decode(
    await tzkt.getContractStorage(address)
  );
  if (isLeft(fixedPriceStorage)) {
    throw Error('Failed to decode `getFixedPriceSales` bigMap ID');
  }
  const fixedPriceBigMapId = fixedPriceStorage.right.sales;
  const params = {
    'value.seller': seller
  }
  const fixedPriceSales = await tzkt.getBigMapKeys(fixedPriceBigMapId, params);
  const decoded = D.FixedPriceSaleBigMap.decode(fixedPriceSales);
  if (isLeft(decoded)) {
    throw Error('Failed to decode `getFixedPriceSales` response');
  }
  return decoded.right;
}

async function getFixedPriceSalesBigMapWithKey(
  tzkt: TzKt,
  address: string,
  collection: string,
  token_id: string
): Promise<D.FixedPriceSaleBigMap> {
  const fixedPriceStorage = D.FixedPriceSaleStorage.decode(
    await tzkt.getContractStorage(address)
  );
  if (isLeft(fixedPriceStorage)) {
    throw Error('Failed to decode `getFixedPriceSales` bigMap ID');
  }
  const fixedPriceBigMapId = fixedPriceStorage.right.sales;
  const params = {
    'value.sale_data.sale_token.fa2_address': collection,
    'value.sale_data.sale_token.token_id': token_id
  }
  const fixedPriceSales = await tzkt.getBigMapKeys(fixedPriceBigMapId, params);
  const decoded = D.FixedPriceSaleBigMap.decode(fixedPriceSales);
  if (isLeft(decoded)) {
    throw Error('Failed to decode `getFixedPriceSales` response');
  }
  return decoded.right;
}

async function getAuctionsBigMapWithKey(
  tzkt: TzKt,
  address: string,
  collection: string,
  token_id: string
): Promise<any> {
  const auctionStorage = 'auctions';

  const params = {
    'value.asset.[0].fa2_address': collection,
    'value.asset.[0].fa2_batch.[0].token_id': token_id
  }
  const auctionData = await tzkt.getContractBigMapKeys(address, auctionStorage, params);

  return auctionData;
}

export async function getBigMapUpdates<K extends t.Mixed, V extends t.Mixed>(
  tzkt: TzKt,
  params: Params,
  content: { key: K; value: V }
) {
  const bigMapUpdates = await tzkt.getBigMapUpdates(params);
  // //console.log("BIGMUADTES",bigMapUpdates);
  const decoder = t.array(D.BigMapUpdateRow(content));
  const decoded = decoder.decode(bigMapUpdates);
  if (isLeft(decoded)) {
    throw Error('Failed to decode `getBigMapUpdates` response');
  }
  return decoded.right;
}

async function getContracts<S extends t.Mixed>(
  tzkt: TzKt,
  params: Params,
  storage: S
) {
  const contracts = await tzkt.getContracts(params);
  const contractsArray = t.array(t.unknown).decode(contracts);
  if (isLeft(contractsArray)) {
    throw Error('Failed to decode `getContracts` response');
  }
  const decodedArray = contractsArray.right.map(D.ContractRow(storage).decode);
  return compact(decodedArray.map(getRight));
}

async function getContract<S extends t.Mixed>(
  tzkt: TzKt,
  address: string,
  params: Params,
  storage: S
) {
  const contract = await tzkt.getContract(address, params);
  const decoded = D.ContractRow(storage).decode(contract);
  if (isLeft(decoded)) {
    throw Error('Failed to decode `getContracts` response');
  }
  return decoded.right;
}

//// Main query functions

export async function getContractNfts(
  system: SystemWithToolkit | SystemWithWallet,
  address: string,
  ownedOnly: boolean
): Promise<D.Nft[]> {
  //  //console.log("ADDRESS",address, ownedOnly);
  let ledgerA = [];
  if(ownedOnly && system.status==='WalletConnected'){
    ledgerA = await getOwnedLedgerBigMap(system.tzkt, address, system.tzPublicKey);
  }else{
    ledgerA = await getLedgerBigMap(system.tzkt, address);
  }
  //  console.log("LEDGER",ledgerA);
  let ledgerB = [];
  if(ledgerA.length === 0){
    if(ownedOnly && system.status==='WalletConnected'){
      ledgerB = await getOwnedLedgerBigMapCustom(system.tzkt, address, system.tzPublicKey);
      const mktLedger = await getOwnedLedgerBigMap(system.tzkt, address, system.config.contracts.marketplace.fixedPrice.tez);
      ledgerB.push(...mktLedger);
    }
    else{
      ledgerB = await getLedgerBigMapCustom(system.tzkt, address);
    }
  }

  const ledger = [...ledgerA, ...ledgerB];

  //console.log("LEDGER",ledger);
  // console.log("LEDGER",ledger);
  let tokensA: D.TokenMetadataBigMap = [];
  // TODO : optimising below API calls
  if(ownedOnly && system.status==='WalletConnected' && ledger.length < 100){
    var keys: string[] = [];
    for(var i=0;i<ledger.length;i++){
      if(typeof ledger[i].key === 'string'){
        keys.push(ledger[i].key);
      }
      else{
        keys.push(ledger[i].key.nat);
      }
    }
    tokensA = await getOwnedTokenMetadataBigMap(system.tzkt, address, keys);
  }else{
    tokensA = await getTokenMetadataBigMap(system.tzkt, address);
  }
  let tokensB: D.TokenMetadataBigMap = [];
  if(tokensA.length === 0){
    if(ownedOnly && system.status==='WalletConnected'){
      var keys: string[] = [];
      for(var i=0;i<ledger.length;i++){
        keys.push(ledger[i].key.nat);
      }
      tokensB = await getOwnedTokenMetadataBigMapCustom(system.tzkt, address, keys);
    }
    else{
      tokensB = await getTokenMetadataBigMapCustom(system.tzkt, address);
    }
  }
  const tokens = [...tokensA, ...tokensB];
  //  console.log("TOKENS",tokens);
  const mktAddress = system.config.contracts.marketplace.fixedPrice.tez;
  //  //console.log("MKTADDRESS",mktAddress);
  let tokenSales;
  if(ownedOnly && system.status==='WalletConnected'){
    tokenSales = await getFixedPriceSalesBigMapBySeller(system.tzkt, mktAddress, system.tzPublicKey);
  }else{
    tokenSales = await getFixedPriceSalesBigMap(system.tzkt, mktAddress);
  }
  //  //console.log("TOKENSALES",tokenSales);
  const activeSales = tokenSales.filter(sale => sale.active);
  //  //console.log("ACTIVESALES",activeSales);

  // Sort by token id - descending
  const tokensSorted = [...tokens].sort((a,b)=>- (Number.parseInt(a.value.token_id, 10) - Number.parseInt(b.value.token_id, 10)));
  // //console.log("tokensSorted",tokensSorted);
  const result =  await Promise.all(
    tokensSorted.map(
      async (token): Promise<D.Nft> => {
        const { token_id: tokenId, token_info: tokenInfo } = token.value;
        // //console.log("TOKEN_ID ", tokenId, tokenInfo);
        // TODO: Write decoder function for data retrieval
        const decodedInfo = _.mapValues(tokenInfo, fromHexString) as any;

        // optimise this call for pagination 
        const resolvedInfo = await system.resolveMetadata(
          decodedInfo[''],
          address 
        );

        const metadata = { ...decodedInfo, ...resolvedInfo.metadata };
        // //console.log("metadata", metadata);
        const saleData = activeSales.find(
          v =>
            v.value.sale_data.sale_token.fa2_address === address &&
            v.value.sale_data.sale_token.token_id === tokenId
        );
        // //console.log("sale", saleData);
        const sale = saleData && {
          id: saleData.id,
          seller: saleData.value.seller,
          price: Number.parseInt(saleData.value.sale_data.price, 10) / 1000000,
          mutez: Number.parseInt(saleData.value.sale_data.price, 10),
          saleToken: {
            address: saleData.value.sale_data.sale_token.fa2_address,
            tokenId: Number.parseInt(saleData.value.sale_data.sale_token.token_id)
          },
          saleId: saleData.value.isLegacy ? 0 : Number.parseInt(saleData.key),
          type: saleData.value.isLegacy ? 'fixedPriceLegacy' : 'fixedPrice'
        };
        // //console.log("sale done",ledger.slice(1,10));
        var owner = ledger.find(e => e.key === tokenId)?.value!;
        if(owner === undefined){
          owner = ledger.find((e:any) => e.key.nat === tokenId.toString() && e.value==='1')?.key.address;
        }
        // //console.log("owner ",tokenId, owner);

        const res =  {
          id: parseInt(tokenId, 10),
          owner: owner,
          title: metadata.name,
          description: metadata.description, 
          artifactUri: metadata.artifactUri, // default can be put 
          metadata: metadata,
          sale
        };
        return res;
      }
    )
  );

  return result;
}

export async function getCollectionNfts(
  system: SystemWithToolkit | SystemWithWallet,
  address: string
): Promise<D.Nft[]> {
  //  console.log("ADDRESS",address);
  let ledgerA = [];
  ledgerA = await getLedgerBigMap(system.tzkt, address);
  //  console.log("LEDGER",ledgerA);
  let ledgerB = [];
  if(ledgerA.length === 0){
      ledgerB = await getLedgerBigMapCustom(system.tzkt, address);
  }
  const ledger = [...ledgerA, ...ledgerB];

  // console.log("LEDGER",ledger);
  let tokensA: D.TokenMetadataBigMap = [];
  // TODO : optimising below API calls
  tokensA = await getTokenMetadataBigMap(system.tzkt, address);
  
  let tokensB: D.TokenMetadataBigMap = [];
  if(tokensA.length === 0){
    tokensB = await getTokenMetadataBigMapCustom(system.tzkt, address);
  }
  const tokens = [...tokensA, ...tokensB];
  //  console.log("TOKENS",tokens);
  const mktAddress = system.config.contracts.marketplace.fixedPrice.tez;
  //  // console.log("MKTADDRESS",mktAddress);
  let tokenSales = await getFixedPriceSalesBigMap(system.tzkt, mktAddress);
  //  // console.log("TOKENSALES",tokenSales);
  const activeSales = tokenSales.filter(sale => sale.active);
  //  // console.log("ACTIVESALES",activeSales);

  //  // Sort by token id - descending
  const tokensSorted = [...tokens].sort((a,b)=>- (Number.parseInt(a.value.token_id, 10) - Number.parseInt(b.value.token_id, 10)));
  //  console.log("tokensSorted",tokensSorted);
  const result =  await Promise.all(
    tokensSorted.map(
      async (token): Promise<D.Nft> => {
        const { token_id: tokenId, token_info: tokenInfo } = token.value;

        const decodedInfo = _.mapValues(tokenInfo, fromHexString) as any;
        
        const metadata = { ...decodedInfo}

        // //console.log("metadata", metadata);
        const saleData = activeSales.find(
          v =>
            v.value.sale_data.sale_token.fa2_address === address &&
            v.value.sale_data.sale_token.token_id === tokenId
        );
        // //console.log("sale", saleData);
        const sale = saleData && {
          id: saleData.id,
          seller: saleData.value.seller,
          price: Number.parseInt(saleData.value.sale_data.price, 10) / 1000000,
          mutez: Number.parseInt(saleData.value.sale_data.price, 10),
          saleToken: {
            address: saleData.value.sale_data.sale_token.fa2_address,
            tokenId: Number.parseInt(saleData.value.sale_data.sale_token.token_id)
          },
          saleId: saleData.value.isLegacy ? 0 : Number.parseInt(saleData.key),
          type: saleData.value.isLegacy ? 'fixedPriceLegacy' : 'fixedPrice'
        };

        // //console.log("sale done",ledger.slice(1,10));
        var owner = ledger.find(e => e.key === tokenId)?.value!;
        if(owner === undefined){
          owner = ledger.find((e:any) => e.key.nat === tokenId.toString() && e.value==='1')?.key.address;
        }
        // //console.log("owner ",tokenId, owner);
        // if(metadata.name && metadata.name==='Seed'){
        //   return;
        // }
        const res =  {
          id: parseInt(tokenId, 10),
          owner: owner,
          title: '',//metadata.name,
          description: '',//metadata.description, 
          artifactUri: '',//metadata.artifactUri, // default can be put 
          metadata: metadata,
          sale
        };
        return res;
      }
    )
  );
  return result;
}

export async function getContractNft(
  system: SystemWithToolkit | SystemWithWallet,
  address: string,
  tokenId: number
): Promise<D.Nft[]> {
   console.log("ADDRESS",address);
  const ledgerA = await getLedgerBigMapWithKey(system.tzkt, address, tokenId.toString());
  //  //console.log("LEDGER",ledgerA);
  let ledgerB = [];
  if(ledgerA.length === 0){
    ledgerB = await getLedgerBigMapCustomWithKey(system.tzkt, address, tokenId.toString());
  }

  const ledger = [...ledgerA, ...ledgerB];
  console.log("LEDGER",ledger);
  const tokensA = await getTokenMetadataBigMapWithKey(system.tzkt, address, tokenId.toString());
  let tokensB: D.TokenMetadataBigMap = [];
  if(tokensA.length === 0){
      tokensB = await getTokenMetadataBigMapCustomWithKey(system.tzkt, address, tokenId.toString());
  }
  const tokens = [...tokensA, ...tokensB];
  //  //console.log("TOKENS",tokens);
  const mktAddress = system.config.contracts.marketplace.fixedPrice.tez;
  //  //console.log("MKTADDRESS",mktAddress);
  const tokenSales = await getFixedPriceSalesBigMapWithKey(system.tzkt, mktAddress, address, tokenId.toString());
  //  //console.log("TOKENSALES",tokenSales);
  const activeSales = tokenSales.filter(sale => sale.active);
  //  //console.log("ACTIVESALES",activeSales);

  // getting auction data
  const auctionAddress = system.config.contracts.auction;
  const tokenAuction = await getAuctionsBigMapWithKey(system.tzkt, auctionAddress, address, tokenId.toString());

  const activeAuctions = tokenAuction.filter((auction: any) => auction.active);

  // Sort by token id - descending
  const tokensSorted = [...tokens].sort((a,b)=>- (Number.parseInt(a.value.token_id, 10) - Number.parseInt(b.value.token_id, 10)));
  // //console.log("tokensSorted",tokensSorted);
  return await Promise.all(
    tokensSorted.map(
      async (token): Promise<D.Nft> => {
        const { token_id: tokenId, token_info: tokenInfo } = token.value;
        // //console.log("TOKEN_ID ", tokenId, tokenInfo);
        // TODO: Write decoder function for data retrieval
        const decodedInfo = _.mapValues(tokenInfo, fromHexString) as any;
        const resolvedInfo = await system.resolveMetadata(
          decodedInfo[''],
          address
        );

        const metadata = { ...decodedInfo, ...resolvedInfo.metadata };
        // //console.log("metadata", metadata);
        const saleData = activeSales.find(
          v =>
            v.value.sale_data.sale_token.fa2_address === address &&
            v.value.sale_data.sale_token.token_id === tokenId
        );
        // //console.log("sale", saleData);
        const sale = saleData && {
          id: saleData.id,
          seller: saleData.value.seller,
          price: Number.parseInt(saleData.value.sale_data.price, 10) / 1000000,
          mutez: Number.parseInt(saleData.value.sale_data.price, 10),
          saleToken: {
            address: saleData.value.sale_data.sale_token.fa2_address,
            tokenId: Number.parseInt(saleData.value.sale_data.sale_token.token_id)
          },
          saleId: saleData.value.isLegacy ? 0 : Number.parseInt(saleData.key),
          type: saleData.value.isLegacy ? 'fixedPriceLegacy' : 'fixedPrice'
        };
        // //console.log("sale done",ledger.slice(1,10));

        // auction data 
        const auctionData = activeAuctions.find(
          (v: any) =>
            v.value.asset[0].fa2_address === address &&
            v.value.asset[0].fa2_batch[0].token_id === tokenId
        );

        const auction = auctionData && {
          id: auctionData.key,
          asset: auctionData.value.asset,
          seller: auctionData.value.seller,
          end_time: auctionData.value.end_time,
          min_raise: auctionData.value.min_raise,
          round_time: auctionData.value.round_time,
          start_time: auctionData.value.start_time,
          current_bid: Number.parseInt(auctionData.value.current_bid,10) / 1000000,
          mutez: Number.parseInt(auctionData.value.current_bid,10),
          extend_time: auctionData.value.extend_time,
          last_bid_time: auctionData.value.last_bid_time,
          highest_bidder: auctionData.value.highest_bidder,
          min_raise_percent: auctionData.value.min_raise_percent
        }
        // {"extend_time":"1","last_bid_time":"2022-03-04T12:55:07Z","highest_bidder":"tz1LX3NtS3ijqDfpc8YXai7smHQc2LkC2o91","min_raise_percent":"1"},"firstLevel":617027,"lastLevel":617047,"updates":2}


        var owner = ledger.reverse().find(e => e.key === tokenId && e.value!==auctionAddress)?.value!;
        if(owner === undefined){
          owner = ledger.find((e:any) => e.key.nat === tokenId.toString() && e.value==='1' && e.value)?.key.address;
        }
        // //console.log("owner ",tokenId, owner);

        const res =  {
          id: parseInt(tokenId, 10),
          owner: owner,
          title: metadata.name,
          description: metadata.description,
          artifactUri: metadata.artifactUri,
          metadata: metadata,
          sale: sale,
          auction: auction
        };
        console.log("res",res);
        return res;
      }
    )
  );
}

export async function getNftAssetContract(
  system: SystemWithToolkit | SystemWithWallet,
  address: string
): Promise<D.AssetContract> {
  const contract = await getContract(system.tzkt, address, {}, t.unknown);
  // console.log("C./ONTRACT",contract);
  if(address === "KT1J6GPgWkgUuubLgRn6EHLL8mjGVarN3JTW")
  return { ...contract, metadata: {name: "BBHANG", description: ''} };
  const collection = await getContractFromFirebase(address);
  if(collection){
    const result =  {...contract, metadata: {name: collection.name, description: collection.description}};
    return result;
  }

  const metaBigMap = await getAssetMetadataBigMap(system.tzkt, address);
  
  let metaUri; 
  if(metaBigMap.length > 1){
    metaUri = metaBigMap.find(v => v.key !== '')?.value;
    if(metaUri === undefined) throw new Error('No content in metadata');
    const metadata = JSON.parse(fromHexString(metaUri));
    console.log("METADATA", {name: metadata.name ?? '', description: ''} );
    return { ...contract, metadata: {name: metadata.name ?? '', description: ''} };
  }else{
    metaUri = metaBigMap.find(v => v.key === '')?.value;
  }
  //console.log("METAURI", metaUri);
  if (!metaUri) {
    const kalahash = metaBigMap.find(v => v.key === '')?.hash;
    if (kalahash === "expru5X1yxJG6ezR2uHMotwMLNmSzQyh5t1vUnhjx4cS6Pv9qE1Sdo") {
      return { ...contract, metadata: {name: "Kalamint", description: ''} };
    }
    else
    {
      throw Error(`Could not extract metadata URI from ${address} storage`);
    }
  }

  // console.log("String Name ", fromHexString(metaUri));
  // console.log("address ", address);
  // if(address === "KT1QqTVamPvqEHMCKkzvYN8mxsxCCYjQKsdD")
  // return { ...contract, metadata: {name: "Froggos", description: ''} };

  // if(address === "KT18pVpRXKPY2c4U2yFEGSH3ZnhB2kL8kwXS")
  // return { ...contract, metadata: {name: "Rarible", description: ''} };

  // Kraznik exception to be removed later 
  if(fromHexString(metaUri)==="https://example.com"){
    if(address === "KT1C1pT3cXyRqD22wHdgmtJjffFG4zKKhxhr")
      return { ...contract, metadata: {name: "Kraznik", description: ''} };

    else if(address==="KT1FnaopRwaUX9kNptcJgWvor2abqVd7iHCc")
      return { ...contract, metadata: {name: "TezFingers", description:"We have come up with a handful of expressive ways to convey peace, spread love, and show brotherhood by giving humanity the most astounding bird." } };

    else
      throw Error(`Could not extract metadata URI from ${address} storage`);
  }

  // console.log("String Name ", fromHexString(metaUri));
  if(fromHexString(metaUri)==="tezos-storage:metadata"){
    return { ...contract, metadata: {name: "hash3points", description: ''} };
  }

  // other contracts
  const { metadata } = await system.resolveMetadata(
    fromHexString(metaUri),
    address
  );
  const decoded = D.AssetContractMetadata.decode(metadata);

  if (isLeft(decoded)) {
    throw Error('Metadata validation failed');
  }

  console.log("DECODED", decoded.right);
  // HEN improvement for name
  if(decoded.right.name === "OBJKTs"){
    return { ...contract, metadata: {...decoded.right, name: "Hicetnunc"} };
  }

  // minter name change
  if(decoded.right.name === "Minter"){
    return { ...contract, metadata: {...decoded.right, name: "ByteBlock"} };
  }

    //console.log("DECODED contract returned", decoded.right);
  return { ...contract, metadata: decoded.right };
}

export async function verifyContract(
  system: SystemWithToolkit | SystemWithWallet,
  address: string,
  owner: string,
): Promise<boolean> {

  try{
    if(address==="") throw new Error("Address is empty");
    const contractInfo: any = await getNftAssetContract(system, address);

    if(contractInfo.creator.alias === "objkt.com Minting Factory"){
      if(!contractInfo.metadata.authors.includes(owner))
        throw new Error("Invalid objkt collection");
      return true;
    }

    if(contractInfo.creator.address!==owner) throw new Error("Please verify details again !");
    
    return true;
  }
  catch(e){
    console.log("ERROR",e);
    return false;
  }
}

export async function getWalletNftAssetContracts(
  system: SystemWithWallet
): Promise<D.AssetContract[]> {
  return await getNftAssetContracts(system, system.tzPublicKey);
};

export async function getNftAssetContracts(
  system: SystemWithWallet,
  tzPublicKey: string
): Promise<D.AssetContract[]> {

  // Get all contracts of the specified wallet address 
  const contracts = await getContracts(
    system.tzkt,
    {
      creator: tzPublicKey,
      includeStorage: 'true'
    },
    t.unknown
  );

   //console.log("CONTRACTS fetched : ",contracts);

  const addresses = _.uniq(
    contracts
      .filter(c => c.kind === 'asset' && c.tzips?.includes('fa2'))
      .map(c => c.address)
  );

  const results: D.AssetContract[] = [];

  if (addresses.length === 0) {
    return results;
  }

  const assetBigMapRows = (
    await getBigMapUpdates(
      system.tzkt,
      {
        path: 'metadata',
        action: 'add_key',
        'contract.in': addresses.join(','),
        limit: '10000'
      },
      {
        key: t.string,
        value: t.string
      }
    )
  ).filter(v => v.content.key === '');

  for (const row of assetBigMapRows) {
    const contract = contracts.find(c => c.address === row.contract.address);
    if (!contract) {
      continue;
    }
    try {
      const metaUri = row.content.value;
      const { metadata } = await system.resolveMetadata(
        fromHexString(metaUri),
        contract.address
      );
      const decoded = D.AssetContractMetadata.decode(metadata);
      if (!isLeft(decoded)) {
        results.push({ ...contract, metadata: decoded.right });
      }
    } catch (e) {
      //console.log(e);
    }
  }

  return results;
}

export type MarketplaceNftLoadingData = {
  loaded: boolean;
  error?: string;
  token: null | D.Nft;
  tokenSale: D.FixedPriceSaleBigMap[number];
  tokenMetadata: undefined | string;
};

export async function getMarketplaceNfts(
  system: SystemWithToolkit | SystemWithWallet,
  address: string,
  reverse: number
): Promise<MarketplaceNftLoadingData[]> {
  const tokenSales = await getFixedPriceSalesBigMap(system.tzkt, address);
  const activeSales = tokenSales.filter(v => v.active);
  var addresses = _.uniq(
    activeSales.map(s => s.value.sale_data.sale_token.fa2_address)
  );

  const uniqueAddresses = Array.from(new Set(addresses));
  // //console.log("ADDRESSES",addresses);
  if (uniqueAddresses.length === 0) {
    return [];
  }

  // managing HEN - having higher number of tokens ( 1 lakh+ in this case )
  // TODO : make the logic generic for all collections
  const HENindex = addresses.indexOf("KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton");
  if(HENindex>-1){
    addresses.splice(HENindex,1);
  }

  const tokenBigMapRows1 = await getBigMapUpdates(
    system.tzkt,
    {
      path: 'token_metadata',
      action: 'add_key',
      'contract.in': addresses.join(','),
      limit: '10000'
    },
    {
      key: t.string,
      value: t.type({
        token_id: t.string,
        token_info: t.record(t.string, t.string)
      })
    }
  );

  const tokenBigMapRows2 = await getBigMapUpdates(
    system.tzkt,
    {
      path: 'assets.token_metadata',
      action: 'add_key',
      'contract.in': addresses.join(','),
      limit: '10000'
    },
    {
      key: t.string,
      value: t.type({
        token_id: t.string,
        token_info: t.record(t.string, t.string)
      })
    }
  );

  const tokenBigMapRows = [...tokenBigMapRows1, ...tokenBigMapRows2];

  // Sort descending (newest first)
  let salesToView;

  // rev = 1 means newest first
  if(Number(reverse) === 1)
    salesToView = [...activeSales].reverse();
  // rev = 2 means oldest first
  else if(Number(reverse) === 2)
    salesToView = [...activeSales];
  // rev = 3 means low to high price
  else if(Number(reverse) === 3){
    salesToView = [...activeSales].sort((a,b)=>{
      return Number(a.value.sale_data.price) - Number(b.value.sale_data.price);
    })
  }
  // rev = 4 means high to low price
  else{
    salesToView = [...activeSales].sort((a,b)=>{
      return - Number(a.value.sale_data.price) + Number(b.value.sale_data.price);
    })
  }

  // //console.log("salesToview", salesToView);

    const salesWithTokenMetadata = salesToView
    .map(x => ({
      tokenSale: x,
      tokenItem: tokenBigMapRows.find(
        item =>
          x.value.sale_data.sale_token.fa2_address === item.contract.address &&
          x.value.sale_data.sale_token.token_id ===
            item.content.value.token_id + ''
      )
    }))
    .map(x => ({
      loaded: false,
      token: null,
      tokenSale: x.tokenSale,
      tokenMetadata: x.tokenItem?.content?.value?.token_info['']
    }));

  // //console.log("salesToken", salesWithTokenMetadata);

  return salesWithTokenMetadata;
}

export const loadMarketplaceNft = async (
  system: SystemWithToolkit | SystemWithWallet,
  tokenLoadData: MarketplaceNftLoadingData
): Promise<MarketplaceNftLoadingData> => {
  var { token, loaded, tokenSale, tokenMetadata } = tokenLoadData;
  const result = { ...tokenLoadData };

  if (token || loaded) {
    return result;
  }
  result.loaded = true;

  try {
    const {
      fa2_address: saleAddress,
      token_id: tokenIdStr
    } = tokenSale.value.sale_data.sale_token;

    const tokenId = parseInt(tokenIdStr, 10);
    const mutez = Number.parseInt(tokenSale.value.sale_data.price, 10);
    const sale = {
      id: tokenSale.id,
      seller: tokenSale.value.seller,
      price: mutez / 1000000,
      mutez: mutez,
      saleToken: {
        address: tokenSale.value.sale_data.sale_token.fa2_address,
        tokenId: Number.parseInt(tokenSale.value.sale_data.sale_token.token_id)
      },
      saleId: tokenSale.value.isLegacy ? 0 : Number.parseInt(tokenSale.key),
      type: tokenSale.value.isLegacy ? 'fixedPriceLegacy' : 'fixedPrice'
    };

    if (!tokenMetadata) {
      try{
        const metadata = await getOwnedTokenMetadataBigMapCustom(system.tzkt, saleAddress, [tokenId.toString()]);
        tokenMetadata = metadata[0].value.token_info[""];
        result.tokenMetadata = tokenMetadata;
        if(tokenMetadata === undefined)
          throw Error("Token metadata not found");
      }
      catch(e){
        result.error = "Couldn't retrieve tokenMetadata";
        console.error("Couldn't retrieve tokenMetadata", { tokenSale });
        return result;
      }
    }

    const { metadata } = (await system.resolveMetadata(
      fromHexString(tokenMetadata),
      saleAddress
    )) as any;

    result.token = {
      address: saleAddress,
      id: tokenId,
      title: metadata.name || '',
      owner: sale.seller,
      description: metadata.description || '',
      artifactUri: metadata.artifactUri || '',
      metadata: metadata,
      sale: sale
    };

    return result;
  } catch (err) {
    result.error = "Couldn't load token";
    console.error("Couldn't load token", { tokenSale, err });
    return result;
  }
};

export const loadCollectionNft = async (
  system: SystemWithToolkit | SystemWithWallet,
  tokenLoadData:D.Nft,
  address: string
): Promise<D.Nft> => {
  var { id, owner ,title, description,  metadata, sale } = tokenLoadData;

  // console.log("loadCollectionNft", { tokenLoadData, address });
  if (title!=='' && description!=='') {
    return tokenLoadData;
  }

  let Loadedmetadata;
  // console.log("loadCollectionNft", { tokenLoadData, address });
  try {
    // console.log(metadata['']);
    if(metadata===undefined || metadata['']===undefined){
      return {
        address: address,
        id: id,
        title: tokenLoadData.metadata.name || '',
        owner: owner,
        description: tokenLoadData.metadata.description || '',
        artifactUri: tokenLoadData.metadata.thumbnailUri || '',
        metadata: tokenLoadData.metadata,
        sale: sale
      };
    }
    else{
      Loadedmetadata = (await system.resolveMetadata(
        metadata[''],
        address
      )) as any;
    }

    console.log("Loadedmetadata", Loadedmetadata);

    const result = {
      address: address,
      id: id,
      title: Loadedmetadata.metadata.name || '',
      owner: owner,
      description: Loadedmetadata.metadata.description || '',
      artifactUri: Loadedmetadata.metadata.artifactUri || '',
      metadata: Loadedmetadata.metadata,
      sale: sale
    };

    return result;
  } catch (err) {
    return tokenLoadData;
  }
};