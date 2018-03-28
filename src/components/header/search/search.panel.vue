<template lang="jade">
  .searchResults(v-on:keyup="closeSearch")
    .innerContainer
      spinner(v-if="isLoading")
      .items(v-if="items.length")
        .item(v-for="item in items" v-if="!isLoading" @click="onSelectItem(item)")
          div.item__image(v-bind:style="{ backgroundImage: 'url(' + item.album.cover + ')' }")
          .item__title {{item.title}}
          .item__artist {{item.artist.name}}
      .noResult(v-if="!items.length && !isLoading") Nothing found

</template>

<script>
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  props: {
    isLoading: Boolean,
    items: Array,
  },
})
export default class SearchResults extends Vue {
  closeSearch() {
    this.$store.dispatch('closeSearch');
  }

  onSelectItem(track) {
    this.$store.dispatch('play', track);
    this.$store.dispatch('fetchArtistTracks', track.artist.id);
    this.$store.dispatch('setCurrentPlaylistName', track.artist.name);
    this.closeSearch();
  }

  mounted() {
    setTimeout(() => {
      document.addEventListener('click', this.onOutsideClick);
      document.addEventListener('keyup', this.onOutsideClick);
    }, 10);
  }

  onOutsideClick(e) {
    if (this.isLoading) {
      return;
    }
    if (
      e.keyCode === 27 ||
      (!this.$el.contains(e.target) &&
        !e.target.classList.contains('search__input'))
    ) {
      document.removeEventListener('click', this.onOutsideClick);
      document.removeEventListener('keyup', this.onOutsideClick);
      this.$store.dispatch('closeSearch');
    }
  }
}
</script>

<style lang="stylus" scoped>
  .searchResults {
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    width: 100%;
    height: 200px;
    background: #1c212c;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: rgba(41, 41, 41, 0.2) 0px 1px 3px 0px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 2px 1px -1px;
  }

  .spinner {
    position: absolute;
    left: 50%;
    margin-left: -12px;
    top: 10px;
  }

  .innerContainer {
    display: flex;
    justify-content: center;
    padding-top: 12px;
    height: 100%;
    position: relative;
  }

  .item__image {
    transition: all 120ms linear;
    height: 110px;
    backgroun-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-color: rgba(255, 255, 255, 0.03);
    border-radius: 4px;
  }

  .items {
    display: flex;
    width: 100%;
    justify-content: center;
  }

  .item {
    display: block;
    margin: 0 8px;
    width: 120px;
    max-width: 120px;
    min-width: 120px;
    overflow: hidden;
    cursor: pointer;
    text-align: center;
    opacity: 1;

    &:hover {
      .item__image {
        opacity: 0.8;
      }
    }
  }

  .item__title {
    padding-top: 12px;
    font-size: 13px;
    font-weight: 600;
    text-align: center;
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .item__artist {
    font-size: 11px;
    font-weight: 600;
    text-align: center;
    color: #8f94a0;
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .viewAll {
    display: flex;
    justify-content: center;
    padding: 12px 20px;
  }

  .noResult {
    color: #373e4e;
    font-weight: 500;
    font-size: 24px;
    align-items: center;
    justify-content: center;
    display: flex;
  }

  .cssload-loader {
    position: absolute;
    top: 80px;
  }
</style>
