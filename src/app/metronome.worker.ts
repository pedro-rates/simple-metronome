/// <reference lib="webworker" />

let timerID : number = null;
let interval : number = null;

addEventListener('message', (message) => {
   if(message.data == 'start') {
    console.log('starting');
    timerID = setInterval(() => {
      postMessage("tick");
    }, interval)
  } else if(message.data.interval) {
    console.log('setting interval');
    interval = message.data.interval;
    if(timerID) {
      clearInterval(timerID);
      timerID = setInterval(() => {
        postMessage("tick");
      }, interval)
    }
  } else if (message.data== 'stop') {
    console.log('stopping');
		clearInterval(timerID);
		timerID = null;
	}
});
