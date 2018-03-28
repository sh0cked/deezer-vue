import 'vue-material/dist/vue-material.min.css';
import './assets/styles.styl';
import 'babel-polyfill'
import Vue from 'vue';
import { MdButton, MdTooltip, MdIcon, MdSnackbar, MdContent, MdMenu, MdList, MdMenuItem} from 'vue-material/dist/components'
// import VueMaterial from 'vue-material'
import App from './App.vue';
import router from './router';
import store from './store/index';
import Spinner from './components/misc/spinner';
import Header from './components/header/header';
import PlaylistTile from './components/playlist.tile/playlist.tile';
import PlayCard from './components/play.card/play.card';
import Footer from './components/footer/footer';
import ActiveTrack from './components/activetrack/active.track.vue';
import AnimatedPlaceholder from './components/misc/animated.placeholder';
import TrackRow from './components/track.row/track.row.vue';
import Sidebar from './components/sidebar/sidebar';
import BottomPlayer from './components/bottom.player/bottom.player';
import Snackbar from './components/misc/snackbar.vue';
import {
  trackTime,
  playsCountFilter,
  playsCountShortFilter,
  timePassed,
} from './filters';

Vue.config.productionTip = false;
Vue.use(MdButton);
Vue.use(MdTooltip);
Vue.use(MdIcon);
Vue.use(MdSnackbar);
Vue.use(MdMenu);
Vue.use(MdList);

Vue.component('spinner', Spinner);
Vue.component('main-header', Header);
Vue.component('main-footer', Footer);
Vue.component('play-list-tile', PlaylistTile);
Vue.component('play-card', PlayCard);
Vue.component('animated-placeholder', AnimatedPlaceholder);
Vue.component('active-track', ActiveTrack);
Vue.component('track-row', TrackRow);
Vue.component('sidebar', Sidebar);
Vue.component('bottom-player', BottomPlayer);
Vue.component('main-snackbar', Snackbar);

Vue.filter('trackTime', trackTime);
Vue.filter('playsCount', playsCountFilter);
Vue.filter('playsCountShort', playsCountShortFilter);
Vue.filter('timePassed', timePassed);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
