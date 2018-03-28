<template lang="jade">
  .trackRow(@click="playTrack()" v-bind:class="{ active: isActive, error: track.hasError }")
    .trackRow__imageWrapper
      div.trackRow__image(v-bind:style="{ backgroundImage: 'url(' + (track.artist.picture_medium || track.album.cover_medium) + ')' }")
    .playIcon
      md-icon(v-if="!isPlaying || !isActive") play_arrow
      md-icon(v-if="isPlaying && isActive") pause
    .trackRow__meta
      .trackRow__title {{track.title}}
      .trackRow__artist {{track.artist.name}}
    .trackRow__right
      .trackRow__info(v-if="track.album") {{track.album.title}}
      .trackRow__duration {{track.duration | trackTime}}
</template>

<script>
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  props: {
    track: Object,
    isPlaying: Boolean,
    isActive: Boolean,
  },
})
export default class TrackRow extends Vue {
  playTrack() {
    this.isPlaying && this.isActive
      ? this.$store.dispatch('pause')
      : this.$store.dispatch('play', this.track);
  }
}
</script>

<style scoped lang="stylus">
  .trackRow {
    display: flex;
    height: 64px;
    padding: 6px 10px;
    width: 100%;
    border-bottom: 1px solid rgba(255, 255, 255, 0.01);
    border-left: 1px solid transparent;
    cursor: pointer;
    position: relative;
    align-items: center;

    &:hover {
      background-color: rgba(255, 255, 255, 0.009);

      .playIcon {
        display: block;
      }

      .trackRow__image {
        opacity: 0.3;
      }
    }

    &.active {
      border-left: 1px solid yellow;
      background-color: rgba(255, 255, 255, 0.02);

      .playIcon {
        display: block;
      }

      .trackRow__image {
        opacity: 0.3;
      }
    }
    &.error {
      background-color: rgba(90, 0, 0, 0.2)
    }
  }

  .playIcon {
    position: absolute;
    left: 18px;
    top: 20px;
    display: none;
  }

  .trackRow__image {
    width: 40px;
    height: 40px;
    background-size: cover;
  }

  .trackRow__meta {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding-left: 12px;
  }

  .trackRow__title {
    font-size: 14px;
    word-wrap: break-word;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 100%;
    overflow: hidden;
    font-weight: 500;
    width: 230px;
  }

  .trackRow__artist {
    font-size: 12px;
    color: rgb(86, 92, 105);
    font-weight: bold;
  }

  .trackRow__right {
    display: flex;
    justify-content: flex-end;
    margin-left: auto;
    min-width: 130px;
    align-items: center;
  }

  .trackRow__duration {
    align-items: center;
    display: flex;
    margin-left: 10px;
    font-size: 12px;
    font-weight: bold;
  }

  .trackRow__imageWrapper {
    position: relative;
    width: 40px;
    min-width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
  }

  .trackRow__actions {
    align-items: center;
    display: flex;
  }

  .trackRow__info {
    padding-right: 10px;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    font-weight: bold;
    color: rgb(86, 92, 105);
    margin-left: auto;
    overflow: hidden;
    max-width: 200px;
    width: 200px;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: block;
    text-align: right;
  }

  .trackRow__likes {
    display: flex;
    align-items: center;
    min-width: 60px;
  }

  .trackRow__plays {
    display: flex;
    align-items: center;
    min-width: 60px;
  }
</style>
