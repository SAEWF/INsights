import React from 'react';
import Countdown from 'react-countdown';

export default function MyTimer(expiryTimestamp: any ) {
    const renderer = ({ h, m, s, completed } : any) => {
      // const time = expiryTimestamp.expiryTimestamp;
      let end_time = Math.ceil(new Date(expiryTimestamp.expiryTimestamp).getTime() / 1000);
      let seconds_ = end_time - Math.floor(Date.now()/1000);
      
      if(seconds_ <= 0){
        // if(toggle){
        //   setToggle(false);
        //   tokenDetails.refresh();
        // }
        return <span>Open to resolve</span>
      }
        
      let hours_ = Math.floor(seconds_/3600);
      let minutes_ = Math.floor((seconds_ - hours_*3600)/60);
      seconds_ = seconds_ - hours_*3600 - minutes_*60;
      // console.log("time = ", hours_, minutes_, seconds_);
    
      return <span>{hours_}h {minutes_}m {seconds_}s</span>;
    };
  
    return (
      <Countdown date={Date.now() + 1000000} renderer={renderer} />
    );
  }
>>>>>>> c7bee27ffe58c654272415cf1374cd5f66abe160
