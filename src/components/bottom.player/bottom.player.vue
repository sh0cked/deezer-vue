<template lang="jade">
  .bottomPlayer(v-if="state.activeTrack")
    .bottomPlayer__inner
      .bottomPlayer__left
        .bottomPlayer__artist
          .bottomPlayer__artWrapper
            .bottomPlayer__art(v-if="state.activeTrack.artist.picture" v-bind:style="{ backgroundImage: 'url(' + state.activeTrack.artist.picture + ')' }")
          .bottomPlayer__meta
            .bottomPlayer__title {{state.activeTrack.title}}
            .bottomPlayer__name(@click="onClickArtist") {{state.activeTrack.artist.name}}
      .bottomPlayer__controls
        .bottomPlayer__controls
          .bottomPlayer__control(@click="toggleShuffleMode()"  v-bind:class="{ active: state.shuffleMode }")
            md-tooltip(md-direction="top") Shuffle
            md-icon shuffle
          .bottomPlayer__control(@click="playPrev()")
            md-tooltip(md-direction="top") Previous
            md-icon skip_previous
          .bottomPlayer__control.playIcon(@click="play()")
            md-tooltip(md-direction="top") Play/pause
            md-icon.mdPlayIcon(v-if="!state.isPlaying") play_arrow
            md-icon.mdPlayIcon(v-if="state.isPlaying") pause
          .bottomPlayer__control(@click="playNext()")
            md-tooltip(md-direction="top") Next
            md-icon skip_next
          .bottomPlayer__control(@click="toggleRepeatMode()" v-bind:class="{ active: state.repeatMode }")
            md-tooltip(md-direction="top") Replay
            md-icon replay
      .bottomPlayer__rightWrapper
        .bottomPlayer__progress
          .bottomPlayer__currentTime {{state.currentTime | trackTime}}
          .bottomPlayer__progressLineWrapper(@mousemove="onProgressMousemove" @mouseleave="onProgressMouseLeave" @click="seek()")
            .bottomPlayer__progressLine
              .bottomPlayer__activeProgress(v-bind:style="{ width: state.progress + '%' }")
              .bottomPlayer__hoverProgress(v-bind:style="{ width: hoverProgress + '%' }")
          .bottomPlayer__endTime {{ (state.activeTrack.duration) | trackTime}}
        .bottomPlayer__right
          .bottomPlayer__vol
            .bottomPlayer__volIcon(v-on:click="toggleVolume")
              md-icon(v-if="!isMute") volume_up
              md-icon(v-if="isMute") volume_mute
            bottom-volume-slider(@volumeChanged="setVolume($event)" v-bind:volume="volume")
</template>

<script>
import Vue from 'vue';
import Component from 'vue-class-component';
import BottomVolumeSlider from './volume.slider.vue';
import { State, Getter } from 'vuex-class';

@Component({
  components: {
    'bottom-volume-slider': BottomVolumeSlider,
  },
})
export default class BottomPlayer extends Vue {
  @State(state => state.audio)
  state;
  @Getter('volume') volume;
  hoverProgress = 0;

  onProgressMousemove(event) {
    let { currentTarget, pageX } = event;
    let progress =
      (pageX - currentTarget.getBoundingClientRect().left) /
      currentTarget.offsetWidth;
    this.hoverProgress = Math.round(progress * 100);
  }

  onVolumeMousemove(event) {
    let { currentTarget, pageX } = event;
    let progress =
      (pageX - currentTarget.getBoundingClientRect().left) /
      currentTarget.offsetWidth;
    this.hoverVolume = Math.round(progress * 100);
  }

  onProgressMouseLeave() {
    this.hoverProgress = 0;
  }

  onVolumeMouseLeave() {
    this.hoverVolume = 0;
  }

  seek() {
    this.$store.dispatch('seek', this.hoverProgress);
  }

  setVolume(val) {
    this.$store.dispatch('setVolume', val / 100);
  }

  play() {
    this.state.isPlaying
      ? this.$store.dispatch('pause')
      : this.$store.dispatch('play', this.state.activeTrack);
  }

  playNext() {
    this.$store.dispatch('playNext');
  }

  playPrev() {
    this.$store.dispatch('playPrev');
  }

  toggleRepeatMode() {
    this.$store.dispatch('toggleRepeatMode', !this.state.repeatMode);
  }

  toggleShuffleMode() {
    this.$store.dispatch('toggleShuffleMode', !this.state.shuffleMode);
  }

  toggleVolume() {
    this.$store.dispatch('toggleVolume');
  }

  get isMute() {
    return this.volume <= 0;
  }

  onClickArtist() {
    this.$router.push({
      name: 'play',
      params: { type: 'artist', id: this.state.activeTrack.artist.id },
    });
  }

  setBodyClass() {
    if (this.state.activeTrack) {
      const $container = document.querySelector('#soundwave');
      $container && $container.classList.add('withBottomPlayer');
    }
  }

  beforeUpdate() {
    this.setBodyClass();
  }

  mounted() {
    this.setBodyClass();
  }

  destroyed() {
    const $container = document.querySelector('#soundwave');
    $container && $container.classList.remove('withBottomPlayer');
  }
}
</script>

<style lang="stylus" scoped>
  .bottomPlayer {
    display: flex;
    justify-content: space-between;
    position: fixed;
    height: 60px;
    width: 100%;
    left: 0;
    right: 0;
    bottom: 0;
    transform: translateZ(0);
    z-index: 10;
    user-select: none;
  }

  .bottomPlayer__inner {
    width: 100%;
    max-width: 1092px;
    margin: 0 auto;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #1c212c;
    box-shadow: rgba(41, 41, 41, 0.2) 0px -1px 3px 0px, rgba(0, 0, 0, 0.14) 0px -1px 1px 0px, rgba(0, 0, 0, 0.12) 0px -2px 1px -1px;
  }

  .bottomPlayer__left {
    display: flex;
    height: 100%;
  }

  .bottomPlayer__artist {
    display: flex;
    flex-direction: row;
    min-width: 300px;
    max-width: 400px;
    overflow hidden
  }

  .bottomPlayer__art {
    flex 0 0 60px
    background-size: cover;
    position absolute
    top 0
    left 0
    width 100%
    height 100%
  }
  .bottomPlayer__artWrapper {
    flex 0 0 60px
    height: 100%;
    position relative
  }

  .bottomPlayer__meta {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 12px;
  }

  .bottomPlayer__title {
    font-size: 15px;
    font-weight: bold;
    color: white;
  }

  .bottomPlayer__name {
    font-size: 12px;
    color: #565c69;
    font-weight: bold;
    cursor pointer
    transition color 80ms ease-in-out
    &:hover {
      color: #8e98ae;
    }
  }

  .bottomPlayer__controls {
    display: flex;
    height: 100%;
    align-items: center;
  }

  .bottomPlayer__control {
    margin: 0 8px;
    cursor: pointer;
    position: relative;
    overflow: hidden;

    &.active {
      .md-icon {
        color: yellow;
      }
    }

    &.playIcon {
      margin: 0 16px
      > i {
        font-size: 32px !important
      }
    }
  }

  .bottomPlayer__rightWrapper {
    display flex
  }

  .bottomPlayer__right {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: 24px;
    height: 100%
    width: 54px
  }

  .bottomPlayer__progress {
    display: flex;
    align-items: center;
    width: 350px;
    position: relative;
    margin-right: 14px;
  }

  .bottomPlayer__currentTime {
    font-size: 12px;
    font-weight: bold;
    position: absolute;
    left: 0;
  }

  .bottomPlayer__endTime {
    font-size: 12px;
    font-weight: bold;
    position: absolute;
    right: 0;
  }

  .bottomPlayer__progressLineWrapper {
    width: calc(100% - 90px);
    display: flex;
    align-items: center;
    justify-content: center;
    height: 12px;
    position: relative;
    left: 45px;
    cursor: pointer;
  }

  .bottomPlayer__progressLine {
    width: 100%;
    height: 2px;
    background-color: #333;
  }

  .bottomPlayer__activeProgress {
    position: absolute;
    height: 2px;
    width: 40%;
    background-color: yellow;
  }

  .bottomPlayer__hoverProgress {
    position: absolute;
    height: 2px;
    width: 40%;
    background-color: rgba(255, 255, 0, 0.5);
  }

  .bottomPlayer__vol {
    cursor pointer
    position relative
    display flex
    justify-content center
    align-items center
    height: 100%
    width: 30px
    min-width: 30px;

    .volumeSlider {
      display none
    }
    &:hover .volumeSlider {
      display: block
    }

    .md-icon {
      position relative
      z-index 100
    }
  }
</style>
