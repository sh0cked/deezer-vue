import store from './index';
const SET_USER = 'SET_USER';
const LOGOUT = 'LOGOUT';

const state = {
  isLoggedIn: false,
  userInfo: {},
};
const getters = {};

const actions = {
  login({ commit }) {
    if (!window.DZ) {
      return
    }
    DZ.login(
      response => {
        if (!response.status) {
          return;
        }
        if (response.authResponse) {
          DZ.api('/user/me', response => {
            commit(SET_USER, response);
          });
          store.dispatch('setPlayerType', 'deezer');
        } else {
          console.log('User cancelled login or did not fully authorize.');
        }
      },
      { perms: 'basic_access,email' }
    );
  },
  logout({ commit }) {
    if (window.DZ) {
      DZ.logout();
    }
    commit(LOGOUT);
    store.dispatch('setPlayerType', 'native');
  },
  setUser({ commit }, userData) {
    commit(SET_USER, userData);
  },
};

const mutations = {
  [SET_USER](state, userInfo) {
    state.isLoggedIn = true;
    state.userInfo = userInfo;
  },
  [LOGOUT](state) {
    state.isLoggedIn = false;
    state.userInfo = {};
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
