<template lang="jade">
  .play(v-if="isLoaded")
    .play__image(
      v-if="state.activeTrack.artist.picture_medium"
      v-bind:style="{ backgroundImage: 'url(' + state.activeTrack.artist.picture_medium + ')' }")
      .play__imageCover
    .play__imageAlbum(
        v-if="state.activeTrack.album.cover_medium"
        v-bind:style="{ backgroundImage: 'url(' + state.activeTrack.album.cover_medium + ')' }")
      .play__imageAlbumCover
    .play__topRight
      a(target="_blank" v-bind:href="state.activeTrack.link" class="play__link")
        md-icon share
          md-tooltip(md-direction="bottom") Play on Deezer
    .play__content
      .play__meta
        .play__trackName {{state.activeTrack.title}}
        .play__artist(@click="navigateTo('artist', state.activeTrack.artist.id)") {{state.activeTrack.artist.name}}
        .play__album(@click="navigateTo('album', state.activeTrack.album.id)") {{state.activeTrack.album.title}}
      .player__controls
        .player__control(@click="toggleShuffleMode()"  v-bind:class="{ active: state.shuffleMode }")
          md-tooltip(md-direction="bottom") Shuffle
          md-icon shuffle
        .player__control(@click="playPrevious()")
          md-tooltip(md-direction="bottom") Previous
          md-icon skip_previous
        .player__control.playIcon(@click="play()")
          md-tooltip(md-direction="bottom") Play/Pause
          md-icon.mdPlayIcon(v-if="!state.isPlaying") play_arrow
          md-icon.mdPlayIcon(v-if="state.isPlaying") pause
        .player__control(@click="playNext()")
          md-tooltip(md-direction="bottom") Next
          md-icon skip_next
        .player__control(@click="toggleRepeatMode()" v-bind:class="{ active: state.repeatMode }")
          md-tooltip(md-direction="bottom") Replay
          md-icon replay
      .player(v-bind:class="{ isLoading: state.isLoading }")
        .player__progress
          .player__currentTime {{state.currentTime | trackTime}}
          .player__progressLineWrapper(@mousemove="onProgressMousemove" @mouseleave="onProgressMouseLeave" @click="seek()")
            .player__progressLoading
            .player__progressLine
              .player__hoverProgress(v-bind:style="{ width: hoverProgress + '%' }")
              .player__activeProgress(v-bind:style="{ width: state.progress + '%' }")
          .player__endTime {{ state.activeTrack.duration | trackTime}}
        .player__volume
          .player__volumeIcon(@click="toggleVolume()")
            md-icon(v-if="!isMute") volume_up
            md-icon(v-if="isMute") volume_mute
          .player__volumeLineWrapper(@mousemove="onVolumeMousemove" @mouseleave="onVolumeMouseLeave" @click="setVolume()")
            .player__volumeLine
              .player__volumeActive(v-bind:style="{ width: volume + '%' }")
              .player__volumeHover(v-bind:style="{ width: hoverVolume + '%' }")
</template>

<script>
import Vue from 'vue';
import Component from 'vue-class-component';
import { Getter, State } from 'vuex-class';

@Component()
export default class ActiveTrack extends Vue {
  @State(state => state.audio)
  state;
  @Getter('volume') volume;

  hoverProgress = 0;
  hoverVolume = 0;

  get isLoaded() {
    return Boolean(this.state.activeTrack);
  }

  get isMute() {
    return this.volume <= 0;
  }

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

  setVolume() {
    this.$store.dispatch('setVolume', this.hoverVolume / 100);
  }

  play() {
    this.state.isPlaying
      ? this.$store.dispatch('pause')
      : this.$store.dispatch('play', this.state.activeTrack);
  }

  playPrevious() {
    this.$store.dispatch('playPrev');
  }

  playNext() {
    this.$store.dispatch('playNext');
  }

  toggleVolume() {
    this.$store.dispatch('toggleVolume');
  }

  toggleRepeatMode() {
    this.$store.dispatch('toggleRepeatMode', !this.state.repeatMode);
  }

  toggleShuffleMode() {
    this.$store.dispatch('toggleShuffleMode', !this.state.shuffleMode);
  }

  navigateTo(type, id) {
    this.$router.push({
      name: 'play',
      params: { type, id },
    });
  }
}
</script>

<style lang="stylus" scoped>

  .play {
    height: 250px;
    width: 546px;
    background-color: #1c212c;
    position: relative
    display flex
  }

  .play__image {
    width: 250px;
    height: 250px;
    position: absolute;
    left: 0;
    background-size: cover;
    background-position center
  }

  .play__imageCover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(to bottom, rgba(28, 33, 44, 0.6) 50%, #1c212c 100%), linear-gradient(to right, rgba(28, 33, 44, 0.6) 50%, #1c212c 100%)
  }

  .play__imageAlbum {
    width: 250px;
    height: 250px;
    position: absolute;
    right: 0;
    background-size: cover;
    background-position center
  }

  .play__imageAlbumCover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(to bottom, rgba(28, 33, 44, 0.6) 50%, #1c212c 100%), linear-gradient(to left, rgba(28, 33, 44, 0.6) 50%, #1c212c 100%)
  }

  .play__content {
    display: flex;
    width: 100%;
    flex-direction column
    position relative
  }

  .play__meta {
    display flex
    flex-direction column
  }

  .play__trackName {
    font-size: 26px;
    font-weight: 900;
    padding: 36px 0 12px
    text-align center
    line-height: 28px;
    font-family: 'Encode Sans', sans-serif;
  }

  .play__artist {
    color: #afafaf;
    font-weight: bold;
    font-size: 13px;
    text-align center
    transition: all 150ms ease-in-out;
    margin auto
    cursor pointer
    &:hover {
      color: white
    }
  }

  .play__album {
    color: #afafaf;
    font-weight: bold;
    font-size: 13px;
    text-align center
    transition: all 150ms ease-in-out;
    margin auto
    cursor pointer
    &:hover {
      color: white
    }
  }

  .activeTrack {
    width: 520px
    min-height: 218px
    margin 0
    display: flex
    flex-direction column
    position relative
  }

  .activeTrack__bgHolder {
    position absolute
    top 0
    bottom 0
    left -24px
    right 0
    width 538px
    height 100%
    background-color: #1C212C
    transform skew(16deg)
  }

  .activeTrack__top {
    display: flex
    position relative
    flex: 1
    z-index 10
  }

  .activeTrack__art {
    width: 128px
    height: 128px
    margin-top: 12px
    margin-left: 12px
    background-size: cover
    background-position: center
    background-repeat: no-repeat
  }

  .activeTrack__right {
    display: flex;
    flex-direction: column
  }

  .activeTrack__innerWrapper {
    min-height: 218px;
    display: flex;
    flex-direction: column;
  }

  .activeTrack__meta {
    display flex
    flex-direction column
    flex 1
    padding-left: 20px

  }

  .activeTrack__topActions {
    position: absolute
    top: 14px
    right: 50px
    display flex
    padding-top: 4 p
  }

  .activeTrack__topIcon {
    width: 32px
    height: 32px
    display flex
    align-items center
    justify-content center
    position relative
    margin: 0 6px
    overflow hidden
    cursor pointer
  }

  .activeTrack__art {
    background-size: cover
    background-position center
    opacity: 0.9
  }

  .activeTrack__name {
    font-size: 22px
    font-weight 900
    padding: 20px 0 10px
    padding-right: 94px
    line-height: 1.2
    font-family: 'Encode Sans', sans-serif
  }

  a.activeTrack__artist {
    color: #999 !important
    font-size: 13px
    line-height 1
    cursor pointer
    transition color 150ms ease-in-out
    &:hover {
      text-decoration none
      color: #aaa !important
    }
  }

  .activeTrack__artistName {
    color: #afafaf
    font-weight bold
    font-size: 13px
    transition: all 150ms ease-in-out
    &:hover {
      color: white
    }
  }

  .activeTrack__bottom {
    flex: 1
    display: flex
    justify-content: center
    flex-direction: column
    position: relative
  }

  .player {
    display flex
    width: 100%
    justify-content: center
    height: 44px
    position: absolute;
    bottom: 12px;
    z-index: 10;
  }

  .player__controls {
    position: absolute;
    bottom: 54px;
    width: 100%;
    display flex
    justify-content center
    align-items: center
    height: 56px
  }

  .player__control {
    width: 40px
    height: 40px
    margin: 0 12px
    cursor pointer
    display flex
    position relative
    user-select none

    &.playIcon {
      width: 60px
      height: 60px
      display flex
      justify-content center
      align-items center
      overflow hidden
      position: relative
      user-select none
      border-radius 50%

    }

    &.active {
      .md-icon {
        color yellow
      }
    }
  }

  .player__progress {
    display flex
    width: 350px
    position: relative
    margin-right: 16px
    align-items center
  }

  .player__currentTime {
    font-size: 12px
    font-weight bold
    position absolute
    left: 0
  }

  .player__endTime {
    font-size: 12px
    font-weight bold
    position absolute
    right: 0
  }

  .player__progressLineWrapper {
    width: calc(100% - 90px)
    height: 12px
    position: relative
    left: 45px
    cursor pointer
    display flex
    align-items center
  }

  .player__progressLine {
    width: 100%
    height: 2px
    background-color: #333
    position: relative
    cursor pointer
  }

  .player__activeProgress {
    position: absolute
    height: 100%
    width: 40%
    background-color: yellow
    z-index 2
  }

  .player__hoverProgress {
    position: absolute
    height: 100%
    width: 60%
    background-color: rgba(255, 255, 0, 0.5)
    z-index 1
  }

  .player__progressLoading {
    height: 2px;
    background: yellow;
    position: absolute;
    width: 100%;
    top: 5px;
    box-shadow: 0 0 24px rgb(206, 203, 0);
    opacity: 0
  }
  .player.isLoading {
    .player__progressLoading {
      animation: boxShadowLoading 1.2s infinite ease-in-out;
    }
  }

  @keyframes boxShadowLoading {
    0% {
      opacity: 0.2
    }
    50% {
      opacity: 1
    }
    100% {
      opacity: 0.2
    }
  }

  .player__volume {
    display flex
    width: 120px
    position: relative
    align-items: center
  }

  .player__volumeIcon {
    margin-right 12px
    position relative
    overflow hidden
    min-width: 24px
    display: block
    min-height: 24px
    cursor: pointer
    user-select none
    transition: all 150ms ease-in-out
    &:hover {
      opacity: 0.9
    }
  }

  .player__volumeLineWrapper {
    width: calc(100% - 20px)
    height: 12px
    position relative
    background-color: transparent
    cursor pointer
  }

  .player__volumeLine {
    width: 100%
    height: 1px
    top: 5px
    position absolute
    background-color: #333
  }

  .player__volumeActive {
    position absolute
    left 0
    height 2px
    width 40%
    background-color yellow
    z-index 2
  }

  .player__volumeHover {
    position absolute
    left 0
    height 2px
    background-color rgba(255, 255, 0, 0.5)
    z-index 1
  }

  .activeTrack__likes {
    display: flex
    position: absolute
    top: 60px
    right: 30px
    font-size: 11px
    font-weight: bold
    color: white
    overflow hidden
  }

  .mdPlayIcon {
    width: 32px
    min-width: 32px
    height: 32px
    min-height: 32px
    font-size: 34px !important

  }

  .album {
    font-size: 12px
    color: #999
  }

  .albumName {
    font-size: 13px
    font-weight bold
    color: #afafaf
    cursor pointer
    transition: all 150ms ease-in-out
    &:hover {
      color: white
    }
  }

  .activeTrack__album {
    margin-top 2px
  }

  .play__topRight {
    position: absolute;
    width 150px
    height 100px
    top 0
    right 0
    z-index: 50;
    display: flex;
    justify-content: flex-end;
    padding: 14px 20px;
  }

  .play__link {
    text-decoration none !important
    .md-icon {
      color: rgba(255,255,255,0.7)
      transition all 120ms ease
    }
    &:hover .md-icon{
      color: white
    }
  }

</style>
