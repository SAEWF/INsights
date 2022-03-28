import React from 'react';
import Countdown from 'react-countdown';
import { useTimer } from 'react-timer-hook'

export default function MyTimer(expiryTimestamp: any ) {
    const {
      seconds,
      minutes,
      hours,
      days,
      isRunning,
      start,
      pause,
      resume,
      restart,
    } = useTimer({ expiryTimestamp, onExpire: () => console.warn('onExpire called') });
  
    const renderer = ({ h, m, s, completed } : any) => {
      const time = expiryTimestamp.expiryTimestamp;
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
      // <div style={{textAlign: 'center'}}>
      //   <h1>react-timer-hook </h1>
      //   <p>Timer Demo</p>
      //   <div style={{fontSize: '100px'}}>
      //     <span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
      //   </div>
      //   <p>{isRunning ? 'Running' : 'Not running'}</p>
      //   <button onClick={start}>Start</button>
      //   <button onClick={pause}>Pause</button>
      //   <button onClick={resume}>Resume</button>
      //   <button onClick={() => {
      //     // Restarts to 5 minutes timer
      //     const time = new Date();
      //     time.setSeconds(time.getSeconds() + 300);
      //     restart(time)
      //   }}>Restart</button>
      // </div>
      <Countdown date={Date.now() + 1000000} renderer={renderer} />
    );
  }