import Vue from 'vue';
import Vuex from 'vuex';
import search from './search';
import audio from './audio';
import home from './home';
import play from './play';
import user from './user';
import genres from './genres'
import sidebar from './sidebar'
import createLogger from 'vuex/dist/logger';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const store = new Vuex.Store({
  modules: {
    // new
    genres,
    sidebar,
    // old
    search,
    audio,
    home,
    play,
    user,
  },
  strict: debug,
  plugins: debug ? [createLogger()] : [],
});

export default store;
