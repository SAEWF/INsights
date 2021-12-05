/* eslint-disable no-redeclare */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { State } from '..';
import {
  createAssetContract,
  mintToken,
  mintTokens,
  transferToken,
  listTokenForSale,
  cancelTokenSale,
  cancelTokenSaleLegacy,
  buyToken,
  buyTokenLegacy,
} from '../../lib/nfts/actions';


import { ErrorKind, RejectValue } from './errors';
import { getContractNftsQuery, getWalletAssetContractsQuery } from './queries';
import { validateCreateNftForm } from '../validators/createNft';
import {
  uploadIPFSFile,
  uploadIPFSImageWithThumbnail
} from '../../lib/util/ipfs';
import { SelectedFile } from '../slices/createNft';
import { connectWallet } from './wallet';
import { NftMetadata } from '../../lib/nfts/decoders';
import { SystemWithToolkit, SystemWithWallet } from '../../lib/system';
import { notifyPending, notifyFulfilled } from '../slices/notificationsActions';
import parse from 'csv-parse/lib/sync';
import * as t from 'io-ts';
// import UpdateArtTokenInFirebase from '../../components/Artist/UpdateArtTokenInFB';
import UpdateSoldnCollectedTokenInFB from '../../components/Artist/UpdateSoldnCollectedTokenInFB';
import DeleteArtTokenInFB from '../../components/Artist/DeleteArtTokenInFB';
import AddSaleDataToFirebase from '../../components/Artist/AddSaleDataToFirebase';
import CancelSale from '../../components/Artist/CancelSaleToken';
import firebase from '../../lib/firebase/firebase';

// import UploadNftToFireStore from '../../components/Marketplace/Catalog/UploadNftToFireStore'

type Options = {
  state: State;
  rejectValue: RejectValue;
};

export const readFileAsDataUrlAction = createAsyncThunk<
  { ns: string; result: SelectedFile },
  { ns: string; file: File },
  Options
>('action/readFileAsDataUrl', async ({ ns, file }, { rejectWithValue }) => {
  const readFile = new Promise<{ ns: string; result: SelectedFile }>(
    (resolve, reject) => {
      let { name, type, size } = file;
      const reader = new FileReader();

      if (!type) {
        if (name.substr(-4) === '.glb') {
          type = 'model/gltf-binary';
        }
        if (name.substr(-5) === '.gltf') {
          type = 'model/gltf+json';
        }
      }

      reader.onload = e => {
        const buffer = e.target?.result;
        if (!buffer || !(buffer instanceof ArrayBuffer)) {
          return reject();
        }
        const blob = new Blob([new Uint8Array(buffer)], { type });
        const objectUrl = window.URL.createObjectURL(blob);
        return resolve({ ns, result: { objectUrl, name, type, size } });
      };
      reader.readAsArrayBuffer(file);
    }
  );
  try {
    return await readFile;
  } catch (e) {
    return rejectWithValue({
      kind: ErrorKind.UnknownError,
      message: 'Could not read file'
    });
  }
});

export const createAssetContractAction = createAsyncThunk<
  { name: string; address: string },
  string,
  Options
>(
  'action/createAssetContract',
  async (name, { getState, rejectWithValue, dispatch, requestId }) => {
    const { system } = getState();
    if (system.status !== 'WalletConnected') {
      return rejectWithValue({
        kind: ErrorKind.WalletNotConnected,
        message: 'Cannot create collection: Wallet not connected'
      });
    }
    try {
      const op = await createAssetContract(system, { name });
      const pendingMessage = `Creating new collection ${name}`;
      dispatch(notifyPending(requestId, pendingMessage));
      await op.confirmation();

      const { address } = await op.contract();
      const fulfilledMessage = `Created new collection ${name} (${address})`;
      dispatch(notifyFulfilled(requestId, fulfilledMessage));
      // TODO: Poll for contract availability on indexer
      dispatch(getWalletAssetContractsQuery());
      return { name, address };
    } catch (e) {
      return rejectWithValue({
        kind: ErrorKind.CreateAssetContractFailed,
        message: 'Collection creation failed'
      });
    }
  }
);

export const addObjktCollectionAction = createAsyncThunk<
  { name: string; address: string },
  { name: string; address: string },
  Options
>(
  'action/addObjktCollection',
  async (args, { getState, rejectWithValue, dispatch, requestId }) => {
    const { system } = getState();
    if (system.status !== 'WalletConnected') {
      return rejectWithValue({
        kind: ErrorKind.WalletNotConnected,
        message: 'Cannot Add collection: Wallet not connected'
      });
    }
    try {
      console.log('args', args);
      const name = args.name;
      const address = args.address;
      const db = firebase.firestore();

      const pendingMessage = `Adding new collection ${name}`;
      dispatch(notifyPending(requestId, pendingMessage));

      const docRef = db.collection('artists').doc(system.tzPublicKey);
      const doc = await docRef.get();

      if(doc.exists){
        await docRef.update({
          objkt: args.address,
          objkt_name: args.name
        });
      } else {
        await docRef.set({
          objkt: args.address,
          objkt_name: args.name
        });
      }

      const fulfilledMessage = `Added new collection ${name} (${address})`;
      dispatch(notifyFulfilled(requestId, fulfilledMessage));
      return { name, address };
    } catch (e) {
      return rejectWithValue({
        kind: ErrorKind.CreateAssetContractFailed,
        message: e.message
      });
    }
  }
);

type Attributes = { name: string; value: string }[];

function appendAttributes(metadata: NftMetadata, attributes: Attributes) {
  return attributes.reduce(
    (acc, row) => {
      const keys = Object.keys(NftMetadata.props);
      const key = keys.find(k => k === row.name) as keyof NftMetadata;
      if (key && NftMetadata.props[key].decode(row.value)._tag === 'Right') {
        return { ...acc, [key]: row.value };
      }
      const attribute = { name: row.name, value: row.value };
      return { ...acc, attributes: [...acc.attributes ?? [], attribute] };
    }, 
    metadata
  );
}

function appendStateMetadata(
  state: State['createNft'],
  metadata: NftMetadata,
  system: SystemWithToolkit | SystemWithWallet
) {
  const appendedMetadata: NftMetadata = {
    ...metadata,
    name: state.fields.name as string,
    minter: system.tzPublicKey || undefined,
    description: state.fields.description || undefined,
    attributes: []
  };
  return appendAttributes(appendedMetadata, state.attributes);
}

export const mintTokenAction = createAsyncThunk<
  { contract: string; metadata: ReturnType<typeof appendStateMetadata> },
  undefined,
  Options
>(
  'action/mintToken',
  async (_, { getState, rejectWithValue, dispatch, requestId }) => {
    const { system, createNft: state } = getState();
    if (state.selectedFile === null) {
      return rejectWithValue({
        kind: ErrorKind.UnknownError,
        message: 'Could not mint token: no file selected'
      });
    } else if (system.status !== 'WalletConnected') {
      return rejectWithValue({
        kind: ErrorKind.WalletNotConnected,
        message: 'Could not mint token: no wallet connected'
      });
    } else if (!validateCreateNftForm(state)) {
      return rejectWithValue({
        kind: ErrorKind.CreateNftFormInvalid,
        message: 'Could not mint token: form validation failed'
      });
    }
    // UploadNftToFireStore();
    let file: File;
    try {
      const { objectUrl, name, type } = state.selectedFile;
      const fetched = await fetch(objectUrl);
      const blob = await fetched.blob();
      file = new File([blob], name, { type });
    } catch (e) {
      return rejectWithValue({
        kind: ErrorKind.UnknownError,
        message: 'Could not mint token: selected file not found'
      });
    }

    let ipfsMetadata: NftMetadata = {};
    try {
      if (/^image\/.*/.test(file.type)) {
        const imageResponse = await uploadIPFSImageWithThumbnail(
          system.config.ipfsApi,
          file
        );
        ipfsMetadata.artifactUri = imageResponse.data.ipfsUri;
        ipfsMetadata.displayUri = imageResponse.data.ipfsUri;
        ipfsMetadata.thumbnailUri = imageResponse.data.thumbnail.ipfsUri;
        ipfsMetadata.formats = [
          {
            fileSize: imageResponse.headers['content-length'],
            mimeType: imageResponse.headers['content-type']
          }
        ];
      } else if (/^video\/.*/.test(file.type)) {
        if (state.displayImageFile === null) {
          return rejectWithValue({
            kind: ErrorKind.IPFSUploadFailed,
            message: 'Ipfs upload failed: Video display file not found'
          });
        }
        let displayFile: File;
        try {
          const { objectUrl, name, type } = state.displayImageFile;
          const fetched = await fetch(objectUrl);
          const blob = await fetched.blob();
          displayFile = new File([blob], name, { type });
        } catch (e) {
          return rejectWithValue({
            kind: ErrorKind.UnknownError,
            message: 'Could not mint token: video display file not found'
          });
        }
        const fileResponse = await uploadIPFSFile(system.config.ipfsApi, file);
        const imageResponse = await uploadIPFSImageWithThumbnail(
          system.config.ipfsApi,
          displayFile
        );
        ipfsMetadata.artifactUri = fileResponse.data.ipfsUri;
        ipfsMetadata.displayUri = imageResponse.data.ipfsUri;
        ipfsMetadata.thumbnailUri = imageResponse.data.thumbnail.ipfsUri;
        ipfsMetadata.formats = [
          {
            fileSize: fileResponse.headers['content-length'],
            mimeType: fileResponse.headers['content-type']
          }
        ];
      } else {
        const fileResponse = await uploadIPFSFile(system.config.ipfsApi, file);
        ipfsMetadata.artifactUri = fileResponse.data.ipfsUri;
        ipfsMetadata.formats = [
          {
            fileSize: fileResponse.data.size,
            mimeType: file.type
          }
        ];
      }
    } catch (e) {
      return rejectWithValue({
        kind: ErrorKind.IPFSUploadFailed,
        message: 'IPFS upload failed'
      });
    }

    const address = state.collectionAddress as string;
    const metadata = appendStateMetadata(state, ipfsMetadata, system);
    var editionNo = getEditionNo(metadata); 
    // console.log("editionNo in mintToken");
    // console.log(editionNo);
      
    var metadataArray = generateMetadataArray(metadata,editionNo)
   
    try {
      if(editionNo>=2){
        // console.log("metadataArray in mintToken");
        // console.log(metadataArray);
        const op = await mintTokens(system, address, metadataArray); // minting multiple tokens
        const pendingMessage = `Minting new tokens from multiple editions`;
        dispatch(notifyPending(requestId, pendingMessage));
        await op.confirmation(2);

        const fulfilledMessage = `Created new tokens from multiple editions in ${address}`;
        // UploadNftToFireStore(system.tzPublicKey,address,metadata); changed location to mintTokens function
        dispatch(notifyFulfilled(requestId, fulfilledMessage));
        dispatch(getContractNftsQuery(address));
        return { contract: address, metadata };
      }
      else{
        // console.log("metadata in mintToken");
        // console.log(metadata);
        
        const op = await mintToken(system, address, metadata);
        const pendingMessage = `Minting new token: ${metadata.name}`;
        dispatch(notifyPending(requestId, pendingMessage));
        await op.confirmation(2);

        const fulfilledMessage = `Created new token: ${metadata.name} in ${address}`;
        // UploadNftToFireStore(system.tzPublicKey,address,metadata); changed to mint token function
        dispatch(notifyFulfilled(requestId, fulfilledMessage));
        dispatch(getContractNftsQuery(address));
        return { contract: address, metadata };
      }
    } catch (e) {
      return rejectWithValue({
        kind: ErrorKind.MintTokenFailed,
        message: 'Mint token failed'
      });
    }
  }
);

function getEditionNo(metadata: NftMetadata) {
  var editionNo = 0;
  // eslint-disable-next-line
  metadata?.attributes?.map(({ name, value }) => 
  {
    if(name === "Edition"){
     // console.log(value);
      editionNo = parseInt(value)
      return editionNo;
    }}
   )
   return editionNo;
}

function generateMetadataArray(metadata: NftMetadata, editionNo: number) {
  // console.log("generateMetadataArray log");
  // console.log(metadata);
  // console.log(editionNo);

  const metArr = [];
  var obj: NftMetadata = {};
  // var metadataName = metadata.name;
  obj.name=metadata.name;
  obj.minter=metadata.minter;
  obj.description=metadata.description;
  obj.artifactUri=metadata.artifactUri;
  obj.displayUri=metadata.displayUri;
  obj.attributes=metadata.attributes;
  // console.log(obj);
  
  for(var i=0;i<editionNo;i++){
    // console.log(i);
    metArr.push(obj)
  }
  //changing name from test,test to test0,test1
  // metArr.forEach((element, index) => {
  //   element.name = element.name +" "+ index;
  // });

  return metArr;
}

interface NonEmptyArrayBrand {
  readonly NonEmptyArray: unique symbol;
}

type ParsedCsvRow = t.TypeOf<typeof ParsedCsvRow>;
const ParsedCsvRow = t.intersection([
  t.type({
    name: t.string,
    description: t.string,
    artifactUri: t.string,
    collection: t.string
  }),
  t.partial({
    displayUri: t.string
  }),
  t.record(t.string, t.string)
]);

const ParsedCsv = t.brand(
  t.array(ParsedCsvRow),
  (n): n is t.Branded<Array<ParsedCsvRow>, NonEmptyArrayBrand> => n.length > 0,
  'NonEmptyArray'
);

export const mintCsvTokensAction = createAsyncThunk<null, undefined, Options>(
  'action/mintCsvTokens',
  async (_, { getState, rejectWithValue, dispatch, requestId }) => {
    const { system, createNftCsvImport: state } = getState();
    if (system.status !== 'WalletConnected') {
      return rejectWithValue({
        kind: ErrorKind.WalletNotConnected,
        message: 'Wallet not connected'
      });
    }
    if (state.selectedCsvFile === null) {
      return rejectWithValue({
        kind: ErrorKind.UnknownError,
        message: 'No CSV file selected'
      });
    }

    let text: string;
    try {
      text = await fetch(state.selectedCsvFile.objectUrl).then(r => r.text());
    } catch (e) {
      return rejectWithValue({
        kind: ErrorKind.UnknownError,
        message: 'Could not mint tokens: selected CSV file not found'
      });
    }
    const parsed = parse(text, { columns: true, skipEmptyLines: true });
    if (!ParsedCsv.is(parsed)) {
      console.log('ERROR:', parsed);
      return rejectWithValue({
        kind: ErrorKind.UnknownError,
        message: ''
      });
    }
    const attrRegex = /^attribute\./;
    const attrRegexTest = new RegExp(attrRegex.source + '.+');
    const metadataArray = parsed.map(p => {
      const attributes = Object.keys(p)
        .filter(k => attrRegexTest.test(k))
        .map(k => ({
          name: k.split(attrRegex)[1],
          value: p[k]
        }));
      const metadata: NftMetadata = {
        name: p.name,
        minter: system.tzPublicKey,
        description: p.description,
        artifactUri: p.artifactUri,
        displayUri: p.displayUri,
        attributes: [],
      };
      return appendAttributes(metadata, attributes);
    });

    try {
      const address = parsed[0].collection;
      const op = await mintTokens(system, address, metadataArray);
      // console.log("system parsed--");
      // console.log(system);
      // console.log(address);
      // console.log(metadataArray);


      const pendingMessage = `Minting new tokens from CSV`;
      dispatch(notifyPending(requestId, pendingMessage));
      await op.confirmation(2);

      const fulfilledMessage = `Created new tokens from CSV in ${address}`;
      dispatch(notifyFulfilled(requestId, fulfilledMessage));
      dispatch(getContractNftsQuery(address));
    } catch (e) {
      return rejectWithValue({
        kind: ErrorKind.MintTokenFailed,
        message: 'Mint tokens from CSV failed'
      });
    }

    return null;
  }
);

export const transferTokenAction = createAsyncThunk<
  { contract: string; tokenId: number; to: string },
  { contract: string; tokenId: number; to: string },
  Options
>('action/transferToken', async (args, api) => {
  const { getState, rejectWithValue, dispatch, requestId } = api;
  const { contract, tokenId, to } = args;
  const { system } = getState();
  if (system.status !== 'WalletConnected') {
    return rejectWithValue({
      kind: ErrorKind.WalletNotConnected,
      message: 'Could not transfer token: no wallet connected'
    });
  }
  try {
    // testing
    // await DeleteArtTokenInFB(system.tzPublicKey, tokenId);
    const op = await transferToken(system, contract, tokenId, to);

    dispatch(notifyPending(requestId, `Transferring token to ${to}`));
    // console.log("CALL FOR DELETE");
    // call to remove the token from the database 
    await DeleteArtTokenInFB(system.tzPublicKey, tokenId);
    await op.confirmation(2);

    dispatch(notifyFulfilled(requestId, `Transferred token to ${to}`));
    dispatch(getContractNftsQuery(contract));
    return args;
  } catch (e) {
    return rejectWithValue({
      kind: ErrorKind.TransferTokenFailed,
      message: 'Transfer token failed'
    });
  }
});

export const listTokenAction = createAsyncThunk<
  { contract: string; tokenId: number; salePrice: number },
  { contract: string; tokenId: number; salePrice: number },
  Options
>('action/listToken', async (args, api) => {
    // console.log("hello");
    // UpdateArtTokenInFirebase();
  const { getState, rejectWithValue, dispatch, requestId } = api;
  const { contract, tokenId, salePrice } = args;
  const { system } = getState();
  const marketplaceContract =
    system.config.contracts.marketplace.fixedPrice.tez;
  if (system.status !== 'WalletConnected') {
    return rejectWithValue({
      kind: ErrorKind.WalletNotConnected,
      message: 'Could not list token: no wallet connected'
    });
  }
  try {
    //testing
    // await AddSaleDataToFirebase(system.tzPublicKey, tokenId, salePrice, contract);

    const op = await listTokenForSale(
      system,
      marketplaceContract,
      contract,
      tokenId,
      salePrice,
      1
    );

    // updating sale data in firebase
    await AddSaleDataToFirebase(system.tzPublicKey, tokenId, salePrice, contract);

    const pendingMessage = `Listing token for sale for ${salePrice / 1000000}ꜩ`;
    dispatch(notifyPending(requestId, pendingMessage));

    await op.confirmation(2);

    const fulfilledMessage = `Token listed for sale for ${
      salePrice / 1000000
    }ꜩ`;

    // console.log(system.tzPublicKey);
    // console.log(tokenId);
    // UpdateArtTokenInFirebase(system.tzPublicKey,tokenId)

    dispatch(notifyFulfilled(requestId, fulfilledMessage));
    dispatch(getContractNftsQuery(contract));
    return args;
  } catch (e) {
      console.log(e);
    return rejectWithValue({
      kind: ErrorKind.ListTokenFailed,
      message: 'List token failed'
    });
  }
});

export const cancelTokenSaleAction = createAsyncThunk<
  { contract: string; tokenId: number; saleId: number; saleType: string },
  { contract: string; tokenId: number; saleId: number; saleType: string },
  Options
>('action/cancelTokenSale', async (args, api) => {
  const { getState, rejectWithValue, dispatch, requestId } = api;
  const { contract, tokenId, saleId, saleType } = args;
  const { system } = getState();
  const marketplaceContract =
    system.config.contracts.marketplace.fixedPrice.tez;
  if (system.status !== 'WalletConnected') {
    return rejectWithValue({
      kind: ErrorKind.WalletNotConnected,
      message: 'Could not list token: no wallet connected'
    });
  }
  try {
    let op;
    await CancelSale(system.tzPublicKey, tokenId);
    if (saleType === "fixedPriceLegacy") {
      op = await cancelTokenSaleLegacy(
        system,
        marketplaceContract,
        contract,
        tokenId
      );
    } else {
      op = await cancelTokenSale(
        system,
        marketplaceContract,
        contract,
        tokenId,
        saleId
      );
    }

    dispatch(notifyPending(requestId, `Canceling token sale`));
    await op.confirmation(2);

    dispatch(notifyFulfilled(requestId, `Token sale canceled`));
    dispatch(getContractNftsQuery(contract));
    return { contract: contract, tokenId: tokenId, saleId: saleId, saleType: saleType };
  } catch (e) {
    return rejectWithValue({
      kind: ErrorKind.CancelTokenSaleFailed,
      message: 'Cancel token sale failed'
    });
  }
});

export const buyTokenAction = createAsyncThunk<
  { contract: string; tokenId: number; saleId: number; saleType: string},
  { contract: string; tokenId: number; tokenSeller: string; salePrice: number; saleId: number; saleType: string; minter: string, royalty: number },
  Options
>('action/buyToken', async (args, api) => {
  const { getState, rejectWithValue, dispatch, requestId } = api;
  const { contract, tokenId, tokenSeller, salePrice, saleId, saleType, minter, royalty } = args;
  let { system } = getState();
  // UpdateSoldnCollectedTokenInFB(system.tzPublicKey,tokenSeller,tokenId); //testing

  const marketplaceContract =
    system.config.contracts.marketplace.fixedPrice.tez;
  if (system.status !== 'WalletConnected') {
    const res = await dispatch(connectWallet());
    if (!res.payload || !('wallet' in res.payload)) {
      return rejectWithValue({
        kind: ErrorKind.WalletNotConnected,
        message: 'Could not list token: no wallet connected'
      });
    }
    system = res.payload;
  }
  try {
    let op;
    var userAddress = system.tzPublicKey;
    var userBigBalance = await system.toolkit.rpc.getBalance(userAddress);
    var userBalance = userBigBalance.toNumber()/1000000;

    // calculate the total price of the token
    const royaltyAmount = salePrice * (royalty/100.0);
    const totalPrice = salePrice + royaltyAmount;

    if(userBalance < totalPrice) throw new Error("Not enough balance");

    // transfer token
    if (saleType === "fixedPriceLegacy") {
      op = await buyTokenLegacy(
        system,
        marketplaceContract,
        contract,
        tokenId,
        tokenSeller,
        salePrice,
        royaltyAmount,
        minter
      );
    } else {
      op = await buyToken(
        system,
        marketplaceContract,
        saleId,
        salePrice,
        royaltyAmount,
        minter,
        tokenSeller
      );
    }
    // upload sold result to firebase
    await UpdateSoldnCollectedTokenInFB(system.tzPublicKey,tokenSeller,tokenId);

    const pendingMessage = `Buying token from ${tokenSeller} for ${totalPrice}`;
    dispatch(notifyPending(requestId, pendingMessage));
    await op.confirmation(2);
    
    const fulfilledMessage = `Bought token from ${tokenSeller} for ${totalPrice}`;
    dispatch(notifyFulfilled(requestId, fulfilledMessage));
    dispatch(getContractNftsQuery(contract));

    return { contract: contract, tokenId: tokenId, saleId: saleId, saleType: saleType };
  } catch (e: any) {
    console.error(e);
    if(e.message === "Not enough balance"){
      return rejectWithValue({
        kind: ErrorKind.BuyTokenFailed,
        message: 'Not enough balance'
      });
    }
    else return rejectWithValue({
      kind: ErrorKind.BuyTokenFailed,
      message: 'Purchase token failed'
    });
  }
});
