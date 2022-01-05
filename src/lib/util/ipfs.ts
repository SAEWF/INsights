import axios from 'axios';

export interface IpfsContent {
  cid: string;
  size: number;
  ipfsUri: string;
  IpfsHash: string;
  url: string;
  publicGatewayUrl: string;
}

export interface IpfsResponse extends IpfsContent {
  thumbnail: IpfsContent;
}

export async function uploadIPFSJSON(api: string, data: any) {
  const params = {
    headers: {
      pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
      pinata_secret_api_key: process.env.REACT_APP_PINATA_API_SECRET 
    }
  };
  return axios.post<any>(`${api}/pinning/pinJSONToIPFS`, data, params);
}

export async function uploadIPFSFile(api: string, file: File) {
  var formData: any = new FormData();
  formData.append('file', file);
  const headers = { 
    maxBodyLength: Infinity,
    headers: {
      'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
      pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
      pinata_secret_api_key: process.env.REACT_APP_PINATA_API_SECRET 
    }
  };
  return axios.post<any>(`${api}/pinning/pinFileToIPFS`, formData, headers);
}

export async function uploadIPFSImageWithThumbnail(api: string, file: File) {
  const formData = new FormData();
  var contents = await file.text();
  formData.append('file', contents);
  const headers = {
    'maxContentLength': -1,
    'maxBodyLength': 'Infinity',
    headers: {
      "Content-Type": 'multipart/form-data',
      pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
      pinata_secret_api_key: process.env.REACT_APP_PINATA_API_SECRET 
    }
  };
  return axios.post<IpfsResponse>(
    `${api}/pinning/pinFileToIPFS`,
    formData,{ headers }
  ).then((resp)=>{
    console.log("RESPONSE", resp);
    return resp;
  })
  .catch((err)=>{
    console.log("ERRR",err);
    return err;
  })
}

// URI Utils

export function isIpfsUri(uri: string) {
  return /^ipfs:\/\/.+/.test(uri);
}

export function ipfsUriToCid(uri: string) {
  const baseRegex = /^ipfs:\/\//;
  const ipfsRegex = new RegExp(baseRegex.source + '.+');
  if (ipfsRegex.test(uri)) {
    return uri.replace(baseRegex, '');
  }
  return null;
}

export type IpfsGatewayConfig = { ipfsGateway: string };
export function ipfsUriToGatewayUrl(config: IpfsGatewayConfig, uri: string) {
  const cid = ipfsUriToCid(uri);
  return cid ? `${config.ipfsGateway}/ipfs/${cid}` : uri;
}

export function uriToCid(uri: string) {
  const ipfsUriCid = ipfsUriToCid(uri);
  if (ipfsUriCid) {
    return ipfsUriCid;
  }
  const baseRegex = /^https:\/\/.*\/ipfs\//;
  const httpRegex = new RegExp(baseRegex.source + '.+');
  if (httpRegex.test(uri)) {
    return uri.replace(baseRegex, '');
  }
  return null;
}
