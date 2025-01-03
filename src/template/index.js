export default (videoId, videoPrivate, url) => `
const getOrientation = () => {
  const orientation = document.fullscreenElement  ? 'landscape' : 'portrait';
  return orientation;
};

const sendEvent = (name, data) => {
  window.ReactNativeWebView.postMessage(JSON.stringify({ name, data }));
};

const addListenersToPlayer = (video) => {
  if (video) {
    video.on("timeupdate", (e) => {
      const percent = Math.round((e.target.currentTime / e.target.duration)*100).toFixed();
      sendEvent('timeupdate', { currentTime: e.target.currentTime, duration: e.target.duration, percent });
    });
    //video.on('audioprocess', (e) => sendEvent('audioprocess', e));
    //video.on('canplay', (e) => sendEvent('canplay', e));
    //video.on('canplaythrough', (e) => sendEvent('canplaythrough', e));
    //video.on('complete', (e) => sendEvent('complete', e));
    video.on('durationchange', (e) => sendEvent('durationchange', e));
    //video.on('emptied', (e) => sendEvent('emptied', e));
    video.on('ended', (e) => sendEvent('ended', e));
    video.on('loadeddata', (e) => sendEvent('loadeddata', e));
    video.on('loadedmetadata', (e) => sendEvent('loadedmetadata', e));
    video.on('pause', (e) => sendEvent('pause', e));
    video.on('play', (e) => sendEvent('play', e));
    video.on('playing', (e) => sendEvent('playing', e));
    video.on('ratechange', (e) => sendEvent('ratechange', e));
    video.on('seeked', (e) => sendEvent('seeked', e));
    video.on('seeking', (e) => sendEvent('seeking', e));
    //video.on('stalled', (e) => sendEvent('stalled', e));
    //video.on('suspend', (e) => sendEvent('suspend', e));
    video.on('volumechange', (e) => sendEvent('volumechange', e));
    video.on('waiting', (e) => sendEvent('waiting', e));
    video.on('error', (e) => sendEvent('error', e));
  }
}

const addListeners = () => {
  const iframe = document.querySelector('iframe');
  if (iframe) {
    window.addEventListener("fullscreenchange", (e) => {
      const orientation = getOrientation();
      sendEvent('fullscreenchange', { e, orientation });
    }, false);

    if (typeof player !== 'undefined') {
      addListenersToPlayer(player);
    } else {
      const video = new Vimeo.Player(iframe);
      addListenersToPlayer(video);
    }
  } else {
    setTimeout(function(){addListeners()}, 300);
  }
};

setTimeout(function(){addListeners()}, 500);
true;
`

/*
  //If the video privacy settings are "Private", you will need to provide the full video URL as a url argument and include the h parameter
  video.loadVideo(${videoPrivate ? url : videoId}).then(function() {
    document.getElementById("container").style.opacity = "1.0";
    document.getElementById("absolute").style.display = "none";
  }).catch(function(err) {
    document.getElementById("container").style.opacity = "1.0";
    document.getElementById("absolute").style.display = "none";
    sendEvent('error', err);
  })
*/
