import store from '../store/index';
let audio;
let currentVol = 0.7;
let lastTrackID;

export const play = track => {
  if (audio) {
    audio.pause();
  }
  let resumeOldTrack = lastTrackID && track.id === lastTrackID;
  if (resumeOldTrack) {
    audio.play();
    return;
  }
  audio = new Audio();
  audio.src = track.preview;

  audio.volume = currentVol;
  let promise = audio.play();
  if (promise && promise.catch) {
    promise.catch(e => {
      console.log(e);
    });
  }
  lastTrackID = track.id;
  if (!resumeOldTrack) {
    setAudioListeners();
  }
};

export const pause = () => {
  audio && audio.pause();
};

export const setVolume = volume => {
  if (!isAudioReady()) {
    return;
  }
  currentVol = volume;
  audio.volume = volume;
};

export const seek = progress => {
  if (!isAudioReady()) {
    return;
  }
  audio.currentTime = audio.duration * progress / 100;
};

function isAudioReady() {
  return audio && audio.readyState !== 0;
}

function loadStartListener() {
  store.dispatch('setAudioLoading', true);
}
function canplayListener() {
  store.dispatch('setAudioLoading', false);
}
function endedListener() {
  store.dispatch('audioEnd');
}
function timeupdateListener() {
  store.dispatch('audioUpdate', getTime(event));
}
function errorListener(err) {
  console.warn('Error on playing audio', err);
  store.dispatch('audioError', err);
}

function setAudioListeners() {
  if (!audio) {
    return;
  }
  audio.addEventListener('loadstart', loadStartListener);
  audio.addEventListener('canplay', canplayListener);
  audio.addEventListener('ended', endedListener);
  audio.addEventListener('timeupdate', timeupdateListener);
  audio.addEventListener('error', errorListener);
}

export function removeAudioListeners() {
  if (!audio) {
    return;
  }
  audio.removeEventListener('loadstart', loadStartListener);
  audio.removeEventListener('canplay', canplayListener);
  audio.removeEventListener('ended', endedListener);
  audio.removeEventListener('timeupdate', timeupdateListener);
  audio.removeEventListener('error', errorListener);
}

export function destroy(){
  audio && audio.pause();
  removeAudioListeners();
  audio = null;
}

function getTime(audioEvent) {
  const { currentTime, duration } = audioEvent.target;
  return {
    currentTime,
    duration,
    progress: currentTime / duration * 100 || 0,
  };
}
