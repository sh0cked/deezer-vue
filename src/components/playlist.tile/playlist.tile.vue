<template lang="jade">

  figure.chartTile(v-on:click="$emit('onTileClick')")
    .chartTile__innerWrapper(v-if='isReady')
      .chartTile__cover(v-bind:style="{ backgroundImage: 'url(' + image + ')' }")
      .chartTile__meta
        ul.chartTile__trackList
          li.chartTile__trackListItem(
          v-for="(track, index) in tracks"
          v-on:click.stop="$emit('onTrackClick', track.id)")
            .chartTile__trackNumber {{ index + 1}}.
            .chartTile__trackArtistWrapper
              .chartTile__trackTitle {{track.title}}
              .chartTile__trackArtist {{track.duration | trackTime}}
          li.chartTile__trackListItem.dots
            span ...

        .chartTile__info
          .chartTile__title {{header}}
          .chartTile__artist(v-if="subHeader")
            .chartTile__artistName {{subHeader}}

</template>

<script>
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  props: {
    image: String,
    tracks: Array,
    header: String,
    subHeader: String,
  },
})
export default class PlaylistTile extends Vue {
  get isReady() {
    return Boolean(this.$props.image && this.$props.header);
  }
}
</script>

<style lang="stylus">
  .chartTile {
    min-width: 514px;
    height: 222px;
    display: flex;
    flex-direction: row;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.05);
    position: relative;
    margin: 0 16px 0 0;
    cursor: pointer;
    background-color: #1c212c;

    &:hover {
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);
    }
  }

  .chartTile__loading {
    display: flex;
    width: 100%;
  }

  .chartTile__innerWrapper {
    display: flex;
    flex-direction: row;
    width: 100%;
    flex: 1;
  }

  .chartTile__cover {
    width: 222px;
    height: 222px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }

  .chartTile__meta {
    padding: 0;
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .chartTile__trackList {
    list-style: none;
    padding: 8px 0 0 0;
    margin: 0;
  }

  .chartTile__trackListItem {
    font-size: 12px;
    padding: 6px 12px;
    line-height: 1.2;
    color: #8f94a0;
    margin: 0 !important;
    padding-bottom: 4px;
    display: flex;
    align-items: center;

    &:hover {
      background-color: rgba(255, 255, 255, 0.05);
    }

    &.dots {
      cursor: default;
      height: 5px;
      padding: 0 12px;
      max-height: 5px;

      &:hover {
        background-color: transparent;
      }
    }
  }

  .chartTile__trackNumber {
    margin-right: 12px;
  }

  .chartTile__trackArtistWrapper {
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
  }

  .chartTile__trackArtist {
    font-size: 12px;
    color: #565c69;
    font-weight: bold;
    line-height: 1;
  }

  .chartTile__trackTitle {
    font-size: 12px;
    font-weight: 500;
    line-height: 1;
    max-width: 210px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
  }

  .chartTile__title {
    font-family: 'Encode Sans', sans-serif;
    font-size: 22px;
    font-weight: bold;
    line-height: 1.1;
    padding-bottom: 8px;
  }

  .chartTile__info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    padding: 8px 16px;
  }

  .chartTile__artistName {
    color: #565c69;
    font-weight: bold;
    font-size: 12px;
  }

</style>
