import { MichelsonMap } from '@taquito/taquito';
import {
  Fa2MultiNftAssetCode,
  Fa2MultiNftFaucetCode
} from '@tqtezos/minter-contracts';
import { Buffer } from 'buffer';
import UploadNftToFireStore from '../../components/Marketplace/Catalog/UploadNftToFireStore';
import { SystemWithWallet } from '../system';
import { uploadIPFSJSON } from '../util/ipfs';
import { NftMetadata } from './decoders';

function toHexString(input: string) {
  return Buffer.from(input).toString('hex');
}


export async function listTokenForSale(
  system: SystemWithWallet,
  marketplaceContract: string,
  tokenContract: string,
  tokenId: number,
  salePrice: number,
  saleQty: number
) {
  const contractM = await system.toolkit.wallet.at(marketplaceContract);
  const contractT = await system.toolkit.wallet.at(tokenContract);
  const batch = system.toolkit.wallet
    .batch([])
    .withContractCall(
      contractT.methods.update_operators([
        {
          add_operator: {
            owner: system.tzPublicKey,
            operator: marketplaceContract,
            token_id: tokenId
          }
        }
      ])
    );

 //Call tranfer entry point
 //https://tzkt.io/KT1KhB9feNM8k62drsHLmNH73C278hn3F9hJ/entrypoints
 
}

export async function cancelTokenSale(
  system: SystemWithWallet,
  marketplaceContract: string,
  tokenContract: string,
  tokenId: number,
  saleId: number
) {
  //Call auction cancle entry point here
  //const contractM = await system.toolkit.wallet.at(marketplaceContract);
  const contractT = await system.toolkit.wallet.at(tokenContract);
  const batch = system.toolkit.wallet
    .batch([])
    .withContractCall(
      contractM.methods.cancel(saleId)
    )
    .withContractCall(
      contractT.methods.update_operators([
        {
          remove_operator: {
            owner: system.tzPublicKey,
            operator: marketplaceContract,
            token_id: tokenId
          }
        }
      ])
    );
  return batch.send();
}

export async function approveTokenOperator(
  system: SystemWithWallet,
  contractAddress: string,
  tokenId: number,
  operatorAddress: string
) {
  const contract = await system.toolkit.wallet.at(contractAddress);
  return contract.methods
    .update_operators([
      {
        add_operator: {
          owner: system.tzPublicKey,
          operator: operatorAddress,
          token_id: tokenId
        }
      }
    ])
    .send();
}

export async function removeTokenOperator(
  system: SystemWithWallet,
  contractAddress: string,
  tokenId: number,
  operatorAddress: string
) {
  const contract = await system.toolkit.wallet.at(contractAddress);
  return contract.methods
    .update_operators([
      {
        remove_operator: {
          owner: system.tzPublicKey,
          operator: operatorAddress,
          token_id: tokenId
        }
      }
    ])
    .send();
}

export async function transferRoyalty(
  system: SystemWithWallet,
  minter: string,
  royalty: number
) {
  // transfer to minter in further updates
  return system.toolkit.wallet
    .transfer({to: minter, amount: royalty})
    .send();
}

export async function bid(){
  //call bid entry point here.
}

export async function resolve(){
  //call bid entry point here.
}