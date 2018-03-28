import Vue from 'vue';
import Router from 'vue-router';
import Home from './pages/Home.vue';
import Play from './pages/Play.vue';
import Genres from './pages/Genres.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/play/:type?/:id?/:trackId?',
      name: 'play',
      component: Play,
    },
    {
      path: '/genres',
      name: 'genres',
      component: Genres,
    },
  ],
  mode: 'history',
  scrollBehavior(to, from) {
    if (to.name === 'play' && from.name === 'play') {
      return;
    }
    return { x: 0, y: 0 };
  },
  base: BASE_PATH || '/'
});
