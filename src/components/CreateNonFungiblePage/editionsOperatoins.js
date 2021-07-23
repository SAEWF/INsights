
const fff = ()=>{

    try {
      const address = parsed[0].collection;
      const op = await mintTokens(system, address, metadataArray);
      console.log("system parsed--");
      console.log(system);
      console.log(address);
      console.log(metadataArray);
     
  
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
  