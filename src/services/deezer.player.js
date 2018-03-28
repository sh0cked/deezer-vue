import store from '../store/index';

let lastTrackId;
let isReady = false;
let requestedTrack;

export const play = track => {
  if (!isReady) {
    requestedTrack = track;
    return;
  }
  const shouldResume = lastTrackId && track.id === lastTrackId;
  if (shouldResume) {
    DZ.player.play();
  } else {
    DZ.player.playTracks([track.id]);
    lastTrackId = track.id;
  }
};
export const pause = () => {
  if (!isReady) {
    return;
  }
  DZ.player.pause();
};
export const seek = seek => {
  if (!isReady) {
    return;
  }
  DZ.player.seek(seek);
};
export const setVolume = volume => {
  if (!isReady) {
    return;
  }
  DZ.player.setVolume(volume * 100);
};

export const initializeDeezerPlayer = () => {
  isReady = true;
  DZ.Event.subscribe('player_position', params => {
    store.dispatch('audioUpdate', getTime(params));
  });
  DZ.Event.subscribe('track_end', function() {
    store.dispatch('audioEnd');
  });
  if (requestedTrack) {
    play({ ...requestedTrack });
  }
  requestedTrack = null;
};

export const destroy = () => {
  isReady = false;
}

function getTime(params) {
  const [currentTime, duration] = params;
  return {
    currentTime,
    duration,
    progress: currentTime / duration * 100 || 0,
  };
}
