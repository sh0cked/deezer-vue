<template lang="jade">
  section.playPage
    .playPage__left
      .topHeading Powered by DEEZER and vue.js.
        .small Audio tracks are limited for 30 seconds.
      animated-placeholder(width="546" height="250" v-if="!isReady" v-bind:style="{'border-radius': 0}")
      active-track(v-if="isReady")
      h2.tracksHeader(v-if="state.currentPlaylistName")  {{state.currentPlaylistName}}
      .playPage__content
        spinner(v-if="state.processing")
        .trackRows(v-show="!state.processing")
          track-row(v-for="track in state.tracks" v-bind:key="track.id"
          v-bind:track="track"
          v-bind:isPlaying="audioState.isPlaying"
          v-bind:isActive="audioState.activeTrack && track.id == audioState.activeTrack.id")
    .playPage__right
      sidebar
</template>

<script>
import Vue from 'vue';
import Component from 'vue-class-component';
import { State } from 'vuex-class';
import { Watch } from 'vue-property-decorator';

@Component()
export default class PlayPage extends Vue {
  @State(state => state.play)
  state;
  @State(state => state.audio)
  audioState;
  isReady = false;

  @Watch('$route')
  routeChanged() {
    this.handleRouteParams();
  }

  async handleRouteParams() {
    const { type, id, trackId } = this.$route.params;
    if (!type || !id) {
      if (!this.state.tracks.length) {
        await this.$store.dispatch('fetchPlayData');
      }
      this.isReady = true;
      return;
    }
    const actionMap = {
      album: 'fetchAlbum',
      playlist: 'fetchPlaylist',
      genre: 'fetchGenreTracks',
      artist: 'fetchArtistTracks',
    };
    await this.$store.dispatch(actionMap[type], id);
    let activeTrack;
    if (trackId) {
      activeTrack = this.state.tracks.find(
        track => Number(track.id) === Number(trackId)
      );
      if (!activeTrack) {
        activeTrack = this.state.tracks[0];
      }
    } else {
      activeTrack = this.state.tracks[0];
    }
    this.$store.dispatch('setActiveTrack', activeTrack);
    this.$store.dispatch('play', activeTrack);
    this.isReady = true;
  }

  mounted() {
    this.handleRouteParams();
  }
}
</script>

<style lang="stylus">
  .playPage {
    display flex
  }

  .playPage__left {
    flex 0 0 50%
  }

  .playPage__right {
    flex: 0 0 50%
    padding-left: 12px;
  }

  .playPage__content {
    display flex
  }

  .trackRows {
    width: 100%;
  }

  .topHeading {
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    font-size: 15px;
    text-transform: uppercase;
    padding: 0 0 0 16px;
    color: white;
    font-weight: bold;
    display: flex;
    height: 72px;
    max-height: 72px;

    .small {
      font-size: 10px;
      line-height: 1;
      color: rgb(86, 92, 105);
      font-weight: 500;
      padding-top: 2px;
      text-transform: none;
    }
  }

  .tracksHeader {
    display: inline-block;
    background: yellow;
    color: black;
    padding: 6px 14px
    font-size: 14px;
    margin-bottom: 16px;
    margin-top: 16px;
    font-weight: 900;
    font-family: 'Encode Sans', sans-serif;
  }


</style>
