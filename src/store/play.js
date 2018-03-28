import store from './index';
import {
  fetchArtistTracks,
  fetchPlaylistById,
  fetchDeezerTop,
  getGenres,
  getGenreTracks,
  fetchAlbumById,
  fetchAlbumTracks,
  getGenreArtists,
  fetchArtistById,
} from '../services/api';
import { getRandomNumber } from '../utils/utils';

export const SET_TRACKS = 'SET_TRACKS';
export const SET_PROCESSING = 'SET_PROCESSING';
export const SET_CURRENT_PLAYLIST_NAME = 'SET_CURRENT_PLAYLIST_NAME';
export const RESET_TRACKS_STATE = 'RESET_TRACKS_STATE';
export const SET_TRACK_ERROR = 'SET_TRACK_ERROR';

const state = {
  tracks: [],
  processing: false,
  currentPlaylistName: '',
};

const actions = {
  async fetchPlayData({ commit, state }, payload = {}) {
    const res = await fetchDeezerTop(1, 60);
    commit(SET_TRACKS, res.tracks.data);
    const { setActiveTrack } = payload;
    if (setActiveTrack || !store.state.audio.activeTrack) {
      store.dispatch('setActiveTrack', res.tracks.data[0]);
    }
  },
  async fetchPlaylist({ commit }, payload) {
    commit(SET_PROCESSING, true);
    const result = await fetchPlaylistById(payload);
    commit(SET_TRACKS, result.tracks.data);
    commit(SET_PROCESSING, false);
    commit(SET_CURRENT_PLAYLIST_NAME, result.title)
  },
  async fetchAlbum({ commit }, payload) {
    commit(SET_PROCESSING, true);
    const albumData = await fetchAlbumById(payload);
    const albumTracks = await fetchAlbumTracks(payload);
    const tracks = albumTracks.data.map(item => ({
      ...item,
      artist: albumData.artist,
      album: albumData,
    }));
    commit(SET_PROCESSING, false);
    commit(SET_TRACKS, tracks);
    commit(SET_CURRENT_PLAYLIST_NAME, `${albumData.artist.name} - ${albumData.title}`)
  },
  async fetchGenreTracks({ commit }, payload) {
    commit(SET_PROCESSING, true);
    const tracks = await getGenreTracks(payload);
    commit(SET_TRACKS, tracks);
    commit(SET_PROCESSING, false);
  },
  async fetchArtistTracks({ commit }, payload) {
    commit(SET_PROCESSING, true);
    const artist = await fetchArtistById(payload);
    const artistTracks = await fetchArtistTracks(payload);
    const tracks = artistTracks.map(item => ({
      ...item,
      artist,
    }));
    commit(SET_TRACKS, tracks);
    commit(SET_PROCESSING, false);
    commit(SET_CURRENT_PLAYLIST_NAME, artist.name)
  },
  playNext({ state }) {
    if (!state.tracks || !state.tracks.length || state.tracks.length === 1) {
      return;
    }
    const isShuffle = store.state.audio.shuffleMode;
    if (isShuffle) {
      const randomIdx = getRandomNumber(0, state.tracks.length - 1);
      store.dispatch('play', state.tracks[randomIdx]);
      return;
    }
    const activeTrack = store.state.audio.activeTrack;
    const nextTrack = hasNextTrack(state.tracks, activeTrack);
    if (nextTrack) {
      store.dispatch('play', nextTrack);
    }
  },
  playPrev({ state }) {
    if (!state.tracks || !state.tracks.length || state.tracks.length === 1) {
      return;
    }
    const isShuffle = store.state.audio.shuffleMode;
    if (isShuffle) {
      const randomIdx = getRandomNumber(0, state.tracks.length - 1);
      store.dispatch('play', state.tracks[randomIdx]);
      return;
    }
    const activeTrack = store.state.audio.activeTrack;
    const prevTrack = hasPrevTrack(state.tracks, activeTrack);
    if (prevTrack) {
      store.dispatch('play', prevTrack);
    }
  },
  setCurrentPlaylistName({ commit }, payload) {
    commit(SET_CURRENT_PLAYLIST_NAME, payload);
  },
  setTrackError({ commit }, payload) {
    commit(SET_TRACK_ERROR, payload);
  },
};

const mutations = {
  [SET_TRACKS](state, payload) {
    state.tracks = payload;
  },
  [SET_PROCESSING](state, payload) {
    state.processing = payload;
  },
  [SET_CURRENT_PLAYLIST_NAME](state, payload) {
    state.currentPlaylistName = payload;
  },
  [RESET_TRACKS_STATE](state) {
    state.tracks = [];
    state.processing = false;
    state.currentPlaylistName = 'Deezer TOP';
  },
  [SET_TRACK_ERROR](state, payload) {
    const track = state.tracks.find(item => item.id === payload.id);
    if (track) {
      track.hasError = true;
    }
  },
};

export default {
  state,
  actions,
  mutations,
};

function hasNextTrack(tracks, currentTrack) {
  if (!tracks.length) {
    return false;
  }
  if (!currentTrack) {
    return tracks[0];
  }
  const idx = tracks.findIndex(item => item.id === currentTrack.id);
  if (idx === -1) {
    return false;
  }
  // last track in list
  if (idx + 1 === tracks.length) {
    return store.state.audio.repeatMode ? tracks[0] : false;
  }
  return tracks[idx + 1];
}

function hasPrevTrack(tracks, currentTrack) {
  if (!tracks.length) {
    return false;
  }
  if (!currentTrack) {
    return tracks[0];
  }
  const idx = tracks.findIndex(item => item.id === currentTrack.id);
  if (idx === -1 || !tracks.length || idx - 1 < 0) {
    return false;
  }
  return tracks[idx - 1];
}
