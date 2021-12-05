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
import { getLedgerBigMapObjkt, getTokenMetadataBigMapObjkt } from './actionObjkt';

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
  console.log("DATA",data);
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
  const data = await tzkt.getContractBigMapKeys(address, path);
  console.log("DATA call",data);
  const decoded = D.LedgerBigMap.decode(data);
  console.log("DECODED",decoded);
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
  const data = await tzkt.getContractBigMapKeys(address, path);
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

async function getBigMapUpdates<K extends t.Mixed, V extends t.Mixed>(
  tzkt: TzKt,
  params: Params,
  content: { key: K; value: V }
) {
  const bigMapUpdates = await tzkt.getBigMapUpdates(params);
  // console.log("BIGMUADTES",bigMapUpdates);
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
  address: string
): Promise<D.Nft[]> {
  // console.log("ADDRESS",address);
  const ledgerA = await getLedgerBigMap(system.tzkt, address);
  // console.log("LEDGER",ledgerA);
  let ledgerB = [];
  if(ledgerA.length === 0){
    ledgerB = await getLedgerBigMapObjkt(system.tzkt, address);
  }

  const ledger = [...ledgerA, ...ledgerB];
  // console.log("LEDGER",ledger);
  const tokensA = await getTokenMetadataBigMap(system.tzkt, address);
  let tokensB: D.TokenMetadataBigMap = [];
  if(tokensA.length === 0){
    tokensB = await getTokenMetadataBigMapObjkt(system.tzkt, address);
  }
  const tokens = [...tokensA, ...tokensB];
  // console.log("TOKENS",tokens);
  const mktAddress = system.config.contracts.marketplace.fixedPrice.tez;
  // console.log("MKTADDRESS",mktAddress);
  const tokenSales = await getFixedPriceSalesBigMap(system.tzkt, mktAddress);
  // console.log("TOKENSALES",tokenSales);
  const activeSales = tokenSales.filter(sale => sale.active);
  // console.log("ACTIVESALES",activeSales);

  // Sort by token id - descending
  const tokensSorted = [...tokens].sort((a,b)=>- (Number.parseInt(a.value.token_id, 10) - Number.parseInt(b.value.token_id, 10)));

  return Promise.all(
    tokensSorted.map(
      async (token): Promise<D.Nft> => {
        const { token_id: tokenId, token_info: tokenInfo } = token.value;

        // TODO: Write decoder function for data retrieval
        const decodedInfo = _.mapValues(tokenInfo, fromHexString) as any;
        const resolvedInfo = await system.resolveMetadata(
          decodedInfo[''],
          address
        );
        const metadata = { ...decodedInfo, ...resolvedInfo.metadata };

        const saleData = activeSales.find(
          v =>
            v.value.sale_data.sale_token.fa2_address === address &&
            v.value.sale_data.sale_token.token_id === tokenId
        );

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

        var owner = ledger.find(e => e.key === tokenId)?.value!;
        if(owner === undefined){
          owner = ledger.find((e:any) => e.key.nat === tokenId.toString() && e.value==='1')?.key.address;
          // console.log("OWNER",owner);
        }
        return  {
          id: parseInt(tokenId, 10),
          owner: owner,
          title: metadata.name,
          description: metadata.description,
          artifactUri: metadata.artifactUri,
          metadata: metadata,
          sale
        };
      }
    )
  );
}

export async function getNftAssetContract(
  system: SystemWithToolkit | SystemWithWallet,
  address: string
): Promise<D.AssetContract> {
  const contract = await getContract(system.tzkt, address, {}, t.unknown);
  // console.log("CONTRACT", contract);
  const metaBigMap = await getAssetMetadataBigMap(system.tzkt, address);
  // console.log("METABIGMAP", metaBigMap);
  const metaUri = metaBigMap.find(v => v.key === '')?.value;
  if (!metaUri) {
    throw Error(`Could not extract metadata URI from ${address} storage`);
  }

  const { metadata } = await system.resolveMetadata(
    fromHexString(metaUri),
    address
  );
  const decoded = D.AssetContractMetadata.decode(metadata);

  
  if (isLeft(decoded)) {
    throw Error('Metadata validation failed');
  }
  // console.log("DECODED returned", decoded.right);
  return { ...contract, metadata: decoded.right };
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

  // console.log("CONTRACTS fetched : ",contracts);

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
      console.log(e);
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
  const addresses = _.uniq(
    activeSales.map(s => s.value.sale_data.sale_token.fa2_address)
  );

  const uniqueAddresses = Array.from(new Set(addresses));

  if (uniqueAddresses.length === 0) {
    return [];
  }

  // console.log(`Loading ${uniqueAddresses.length} addresses`, uniqueAddresses);

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

  // console.log(`Loaded ${tokenBigMapRows.length} rows`, tokenBigMapRows);

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

  // console.log("salesToview", salesToView);

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

  // console.log("salesToken", salesWithTokenMetadata);

  return salesWithTokenMetadata;
}

export const loadMarketplaceNft = async (
  system: SystemWithToolkit | SystemWithWallet,
  tokenLoadData: MarketplaceNftLoadingData
): Promise<MarketplaceNftLoadingData> => {
  const { token, loaded, tokenSale, tokenMetadata } = tokenLoadData;
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
      result.error = "Couldn't retrieve tokenMetadata";
      console.error("Couldn't retrieve tokenMetadata", { tokenSale });
      return result;
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