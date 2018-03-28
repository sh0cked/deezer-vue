<template lang="jade">
  #soundwave
    main-header
    router-view
    main-footer
    bottom-player
    main-snackbar
</template>


<script>
import Vue from 'vue';
import Component from 'vue-class-component';
import { APP_ID, APP_URL } from './config';
import { initializeDeezerPlayer } from './services/deezer.player';
@Component()
export default class App extends Vue {

  beforeCreate(){
    // this.$store.dispatch('fetchPlayData');
  }
  mounted() {
    window.dzAsyncInit = () => {
      DZ.init({
        appId: APP_ID,
        channelUrl: `${APP_URL}/channel.html`,
        player: {
          onload: response => {
            initializeDeezerPlayer();
          },
        },
      });
      DZ.ready(sdk_options => {
        DZ.getLoginStatus(response => {
          if (response.status === 'connected') {
            DZ.api('/user/me', response => {
              if (response.error) {
                return;
              }
              this.$store.dispatch('setUser', response);
              this.$store.dispatch('setPlayerType', 'native');
            });
          }
        });
      });
    };

    (function() {
      const e = document.createElement('script');
      e.src = 'https://e-cdns-files.dzcdn.net/js/min/dz.js';
      e.async = true;
      document.getElementById('dz-root').appendChild(e);
    })();
  }
}
</script>
