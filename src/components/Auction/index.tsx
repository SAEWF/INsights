import React from 'react'
import { Button } from '@chakra-ui/react';
import { configureAuction } from '../../lib/nfts/Auction/action'
import { useSelector } from '../../reducer';

function Index() {
  const { system } = useSelector(s => s);
  const asset: any = [
    {
      fa2_address: 'KT1J6GPgWkgUuubLgRn6EHLL8mjGVarN3JTW',
      fa2_batch: [
        {
          "token_id" : "1",
          "amount" : "1"
        }
      ]
    }
  ];

  const bidding = () => {
    console.log("bid call");
    let op = configureAuction(system , "KT1LWwLzyxy3BvkEqNr2Lfe5xvk7geyNnZQt", 100000, 1, 1, asset);
    console.log(op);
  };

  return (
    <div>
      <Button onClick={bidding}> Bid now </Button>
    </div>
  )
}

export default Index;