import {
  fetchDeezerTop,
  fetchAlbumTracks,
  fetchPlaylistTracks,
  fetchEditoralTracks,
} from '../services/api';

const SET_PAGE_ALBUMS = 'SET_PAGE_ALBUMS';
const SET_PAGE_TOP_ALBUMS = 'SET_PAGE_TOP_ALBUMS';
const SET_PAGE_PLAYLISTS = 'SET_PAGE_PLAYLISTS';
const SET_PAGE_TOP_PLAYLISTS = 'SET_PAGE_TOP_PLAYLISTS';
const RESET_PAGE_ALBUMS_STATE = 'RESET_PAGE_ALBUMS_STATE';
const SET_CONTENT_LOADED = 'SET_CONTENT_LOADED';
const APPEND_CONTENT = 'APPEND_CONTENT';
const SET_PROCESSING = 'SET_PROCESSING';

const state = {
  albums: [],
  topAlbums: [],
  playlists: [],
  topPlaylists: [],
  contentLoaded: false,
  currentPlaylistsPage: 1,
  currentAlbumsPage: 1,
  playlistsLoadingMore: false,
  albumsLoadingMore: false,
};

const actions = {
  async fetchAlbumsAndPlaylists({ commit }, { page, perPage } = {}) {
    let topChartsData = await fetchDeezerTop(page, perPage);
    commit(SET_PAGE_ALBUMS, topChartsData.albums.data);
    let result = await Promise.all([
      fetchAlbumTracks(topChartsData.albums.data[0].id),
      fetchAlbumTracks(topChartsData.albums.data[1].id),
    ]);
    commit(SET_PAGE_TOP_ALBUMS, [
      {
        album: topChartsData.albums.data[0],
        tracks: result[0].data.slice(0, 4),
      },
      {
        album: topChartsData.albums.data[1],
        tracks: result[1].data.slice(0, 4),
      },
    ]);
    const playLists = topChartsData.playlists.data;
    commit(SET_PAGE_PLAYLISTS, topChartsData.playlists.data);
    let topPlaylistsData = await Promise.all([
      fetchPlaylistTracks(playLists[0].id),
      fetchPlaylistTracks(playLists[1].id),
    ]);
    commit(SET_PAGE_TOP_PLAYLISTS, [
      {
        playlist: playLists[0],
        tracks: topPlaylistsData[0].data.slice(0, 4),
      },
      {
        playlist: playLists[1],
        tracks: topPlaylistsData[1].data.slice(0, 4),
      },
    ]);
    commit(SET_CONTENT_LOADED, true);
  },

  async loadMoreContent({ commit }, { type, page, perPage }) {
    if (type !== 'playlists' && type !== 'albums') {
      return;
    }
    if (!page || !perPage) {
      return;
    }
    const contentType =
      type === 'playlists' ? 'playlistsLoadingMore' : 'albumsLoadingMore';

    commit(SET_PROCESSING, { type: contentType, value: true });
    const res = await fetchDeezerTop(page, perPage);
    const data = res[type].data;
    commit(APPEND_CONTENT, { type, data });
    commit(SET_PROCESSING, { type: contentType, value: false });
  },
  resetHomepageState({ commit }) {
    commit(RESET_PAGE_ALBUMS_STATE);
  },
};

const mutations = {
  [SET_PAGE_ALBUMS](state, payload) {
    state.albums = payload;
  },
  [SET_PAGE_TOP_ALBUMS](state, payload) {
    state.topAlbums = payload;
  },
  [SET_PAGE_PLAYLISTS](state, payload) {
    state.playlists = payload;
  },
  [SET_PAGE_TOP_PLAYLISTS](state, payload) {
    state.topPlaylists = payload;
  },
  [RESET_PAGE_ALBUMS_STATE](state) {
    state.albums = [];
    state.topAlbums = [];
    state.playlists = [];
    state.topPlaylists = [];
    state.contentLoaded = false;
  },
  [SET_CONTENT_LOADED](state, payload) {
    state.contentLoaded = payload;
  },
  [APPEND_CONTENT](state, payload) {
    let { type, data } = payload;
    state[type] = [...state[type], ...data];
    type === 'playlists'
      ? (state.currentPlaylistsPage += 1)
      : (state.currentAlbumsPage += 1);
  },
  [SET_PROCESSING](state, payload) {
    const { type, value } = payload;
    state[type] = value;
  },
};

const getters = {
  homeAlbums: state =>
    state.albums.slice(2).map(item => ({
      id: item.id,
      image: item.cover_big,
      header: item.title,
      artist: {
        name: item.artist.name,
        image: item.artist.picture_small,
      },
    })),
  homeTopAlbums: state =>
    state.topAlbums.map(item => ({
      id: item.album.id,
      image: item.album.cover_big,
      tracks: item.tracks,
      header: item.album.title,
      subHeader: item.album.artist.name,
    })),
  homePlaylists: state =>
    state.playlists.slice(2).map(item => ({
      id: item.id,
      image: item.picture_big,
      tracks: item.tracks,
      header: item.title,
    })),
  homeTopPlaylists: state =>
    state.topPlaylists.map(item => ({
      id: item.playlist.id,
      image: item.playlist.picture_big,
      tracks: item.tracks,
      header: item.playlist.title,
    })),
};

export default {
  state,
  actions,
  mutations,
  getters,
};
