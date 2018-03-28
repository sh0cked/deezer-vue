import { fetchDeezerTop } from '../services/api';

const SIDEBAR_FETCH_DATA = 'SIDEBAR_FETCH_DATA';
const SIDEBAR_SET_DATA = 'SIDEBAR_SET_DATA';
const SIDEBAR_APPEND_DATA = 'SIDEBAR_APPEND_DATA';
const SIDEBAR_FETCH_ARTISTS = 'SIDEBAR_FETCH_ARTISTS';
const SIDEBAR_SET_ARTISTS = 'SIDEBAR_SET_ARTISTS';
const SIDEBAR_SET_PROCESSING = 'SIDBEAR_SET_PROCESSING';

const ITEMS_PER_PAGE = 60;
const state = {
  playlists: [],
  artists: [],
  loadingMore: false,
  hasMore: true,
  lastLoadedPage: 1,
};

const actions = {
  async fetchDataForSidebar({ commit }, { page, perPage }) {
    const data = await fetchDeezerTop(page, perPage);
    commit(SIDEBAR_SET_DATA, data);
  },
  async sidebarLoadMore({ commit, state }) {
    commit(SIDEBAR_SET_PROCESSING, true);
    const data = await fetchDeezerTop(state.lastLoadedPage + 1, ITEMS_PER_PAGE);
    commit(SIDEBAR_APPEND_DATA, data);
    commit(SIDEBAR_SET_PROCESSING, false);
  },
};

const mutations = {
  [SIDEBAR_SET_DATA](state, { artists, playlists } = {}) {
    state.artists = artists.data;
    state.playlists = playlists.data;
    if (
      artists.data.length < ITEMS_PER_PAGE ||
      playlists.data.length < ITEMS_PER_PAGE
    ) {
      state.hasMore = false;
    }
  },
  [SIDEBAR_SET_PROCESSING](state, payload) {
    state.loadingMore = payload;
  },
  [SIDEBAR_APPEND_DATA](state, { artists, playlists } = {}) {
    state.artists = state.artists.concat(artists.data);
    state.playlists = state.playlists.concat(playlists.data);
    state.lastLoadedPage += 1;
    if (
      artists.data.length < ITEMS_PER_PAGE ||
      playlists.data.length < ITEMS_PER_PAGE
    ) {
      state.hasMore = false;
    }
  },
};

const getters = {};

export default {
  state,
  actions,
  mutations,
  getters,
};
