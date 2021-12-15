export enum ErrorKind {
  UnknownError,
  WalletNotConnected,
  CreateAssetContractFailed,
  CreateNftFormInvalid,
  MintTokenFailed,
  TransferTokenFailed,
  ListTokenFailed,
  CancelTokenSaleFailed,
  BuyTokenFailed,
  GetNftAssetContractFailed,
  GetContractNftsFailed,
  GetWalletNftAssetContractsFailed,
  GetNftAssetContractsFailed,
  GetMarketplaceNftsFailed,
  IPFSUploadFailed,
  WalletAlreadyConnected,
  WalletPermissionRequestDenied,
  AddObjktCollectionFailed
}

export interface RejectValue {
  kind: ErrorKind;
  message: string;
  errorObj?: any;
}
