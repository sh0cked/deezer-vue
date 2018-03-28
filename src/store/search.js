import { search } from '../services/api';

const START_SEARCH = 'START_SEARCH';
const CLOSE_SEARCH = 'CLOSE_SEARCH';
const SEARCH_RESULTS = 'SEARCH_RESULTS';
const CLEAR_SEARCH_RESULTS = 'CLEAR_SEARCH_RESULTS';
const SEARCH_ARTIST_RESULTS = 'SEARCH_ARTIST_RESULTS';
const OPEN_SEARCH_PANEL = 'OPEN_SEARCH_PANEL';

const state = {
  searchResults: [],
  foundArtists: [],
  processing: false,
  searchQuery: '',
  isOpened: false,
};

const getters = {
  searchResults: state => state.searchResults,
  processing: state => state.processing,
  artists: state => state.foundArtists,
};

const actions = {
  startSearch({ commit, state }, query) {
    commit(START_SEARCH);
    search(query).then(res => {
      commit(SEARCH_RESULTS, res);
    });
  },
  openSearchPanel({ commit }) {
    commit(OPEN_SEARCH_PANEL);
  },
  closeSearch({ commit }) {
    commit(CLOSE_SEARCH);
  },
  clearSearch({ commit }) {
    commit(CLEAR_SEARCH_RESULTS);
  },
};

const mutations = {
  [START_SEARCH](state) {
    state.processing = true;
  },
  [OPEN_SEARCH_PANEL](state) {
    state.isOpened = true;
  },
  [CLOSE_SEARCH](state) {
    state.isOpened = false;
    state.processing = false;
    state.searchResults = [];
  },
  [SEARCH_RESULTS](state, payload) {
    state.searchResults = payload;
    state.processing = false;
  },
  [SEARCH_ARTIST_RESULTS](state, payload) {
    state.foundArtists = payload;
  },
  [CLEAR_SEARCH_RESULTS](state) {
    state.searchResults = [];
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
