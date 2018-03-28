import { getGenres, getGenreArtists } from '../services/api';

export const SET_GENRES = 'SET_GENRES';
export const SET_PROCESSING = 'SET_PROCESSING';
export const SET_GENRE_ARTISTS = 'SET_GENRE_ARTISTS';

const state = {
  genres: [],
  genresArtist: {},
  loaded: false,
};

const actions = {
  async fetchAllGenreData({ commit }) {
    const genres = await getGenres();
    commit(SET_GENRES, genres);
    const genreArtists = {};
    await Promise.all(
      genres.map(async genre => {
        genreArtists[genre.id] = await getGenreArtists(genre.id, 5);
      })
    );
    commit(SET_GENRE_ARTISTS, genreArtists);
  },
};

const mutations = {
  [SET_GENRES](state, payload) {
    state.genres = payload;
    state.loaded = true;
  },
  [SET_GENRE_ARTISTS](state, payload) {
    state.genresArtist = payload;
  },
};

const getters = {
  genreList: state => state.genres.slice(1), // Skip 'All' genre item
};

export default {
  state,
  actions,
  mutations,
  getters,
};
