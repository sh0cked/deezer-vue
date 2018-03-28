<template>
  <md-snackbar class="mainSnackbar"
               :md-position="position"
               :md-duration="duration"
               :md-active.sync="showSnackbar"
               md-persistent>
    <span>{{text}}</span>
    <md-button
      class="md-primary"
      @click="showSnackbar = false">Close
    </md-button>
  </md-snackbar>
</template>

<script>
import Vue from 'vue';
import Component from 'vue-class-component';
import { eventBus } from '../../utils/utils';

@Component()
export default class Snackbar extends Vue {
  text = 'Error occured';
  duration = 60 * 1000;
  showSnackbar = false;
  position = 'center';

  mounted() {
    eventBus.$on('showSnackbar', text => {
      this.text = text;
      this.showSnackbar = true;
    });
  }
}
</script>

<style lang="stylus">
  .md-snackbar.mainSnackbar {
    background-color: #11141b
    z-index: 130

    .md-button {
      color: white
    }
  }

  .md-snackbar-content {
    font-size: 12px;
    font-weight: 500;
  }
</style>
