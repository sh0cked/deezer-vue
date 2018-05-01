<template lang="jade">
  section.chartsPage
    section.chartHero
      .chartHero__bgHolder(v-bind:style="{ backgroundImage: 'url(images/main.jpg)' }")
      .chartHero__bgCover
      .chartHero__content
        h1.chartHero__mainHeading Discover top charts and albums
        h2.chartHero__smallHeading Explore music, entertainment and podcast Channels
        h2.chartHero__smallHeading The music you want. Anywhere, anytime.
        router-link(to="/play")
          md-button.md-warn.charHero__btn Explore Deezer TOP

    h2.chartList__mainHeading Trending Albums

    section.chartList(v-if="!state.contentLoaded")
      .chartTiles__wrapper
        animated-placeholder(width="514" height="222" v-bind:style="{'margin-right': '16px'}")
        animated-placeholder(width="514" height="222")

    section.chartList(v-if="state.contentLoaded")
      .chartTiles__wrapper
        play-list-tile(
        v-for="item in topAlbums"
        v-bind:key="item.id"
        v-bind:image = 'item.image'
        v-bind:tracks = 'item.tracks'
        v-bind:header='item.header'
        v-bind:subHeader='item.subHeader'
        v-on:onTileClick='navigateTo("album",item.id)'
        v-on:onTrackClick='navigateTo("album",item.id,$event)')

    section.chartList.chartlist__cardsWrapper(v-if="!state.contentLoaded")
      .chartlist__wrapper
        animated-placeholder(v-for="(item, index) in fakeAlbums" v-bind:key="index" width="160" height="256" v-bind:style="{'margin': '10px 8px 14px'}")
    section.chartList.chartlist__cardsWrapper(v-if="state.contentLoaded")
      .chartlist__wrapper
        play-card(
        v-for="item in albums"
        v-bind:type="'track'"
        v-bind:id="item.id"
        v-bind:key="item.id"
        v-bind:image="item.image"
        v-bind:header="item.header"
        v-bind:artist="item.artist"
        v-on:onCardClick="navigateTo('album',item.id)"
        )
      .chartList__loadMore
        md-button.chartList__loadMoreBtn(v-on:click="loadMore('albums')" v-bind:disabled="state.albumsLoadingMore") Load More

    h2.chartList__mainHeading(v-if="state.contentLoaded") Top Charts

    section.chartList(v-if="state.contentLoaded")
      .chartTiles__wrapper
        play-list-tile(
        v-for="item in topPlaylists"
        v-bind:key="item.id"
        v-bind:image = 'item.image'
        v-bind:tracks = 'item.tracks'
        v-bind:header='item.header'
        v-on:onTileClick="navigateTo('playlist',item.id)"
        v-on:onTrackClick="navigateTo('playlist',item.id, $event)")

    section.chartList.topChart__bottomSection.chartlist__cardsWrapper(v-if="state.contentLoaded")
      .chartlist__wrapper
        play-card(
        v-for="item in playlists"
        v-bind:key="item.id"
        v-bind:image="item.image"
        v-bind:header="item.header"
        v-bind:artist="item.artist"
        v-on:onCardClick="navigateTo('playlist',item.id)"
        )
      .chartList__loadMore
        md-button.chartList__loadMoreBtn(v-on:click="loadMore('playlists')" v-bind:disabled="state.playlistsLoadingMore") Load More


</template>

<script>
import Vue from 'vue';
import Component from 'vue-class-component';
import { State, Getter } from 'vuex-class';

@Component({})
export default class HomePage extends Vue {
  @State(state => state.home)
  state;

  @Getter('homeAlbums') albums;
  @Getter('homeTopAlbums') topAlbums;
  @Getter('homePlaylists') playlists;
  @Getter('homeTopPlaylists') topPlaylists;

  fakeAlbums = Array.from({ length: 12 });

  currentAlbumPage = 1;
  currentChartPage = 1;
  ITEMS_PER_PAGE = 20; // 3 rows * 6 cards + 2 tiles

  navigateTo(type, id, trackId) {
    this.$router.push({
      name: 'play',
      params: { type, id, trackId },
    });
  }

  created() {
    this.$store.dispatch('fetchAlbumsAndPlaylists', {
      perPage: this.ITEMS_PER_PAGE,
      page: 1,
    });
  }

  loadMore(type) {
    const page =
      type === 'albums' ? ++this.currentAlbumPage : ++this.currentChartPage;
    this.$store.dispatch('loadMoreContent', {
      type,
      page,
      perPage: this.ITEMS_PER_PAGE,
    });
  }

  destroyed() {
    this.$store.dispatch('resetHomepageState');
  }
}
</script>

<style lang="stylus">
  .chartHero {
    height: 320px;
    background-color: #000;
    overflow: hidden;
    position: relative;
  }

  .chartHero__bgHolder {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-repeat: no-repeat;
  }

  .chartHero__bgCover {
    background-color: #1c212c;
    opacity: 0.85;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
  }

  .chartHero__content {
    position: relative;
    z-index: 2;
    padding: 16px 24px;
    margin-top: 44px;
  }

  .chartHero__mainHeading {
    font-size: 34px;
    margin: 44px 0 20px 0;
    font-family: 'Encode Sans', sans-serif;
  }

  .chartHero__smallHeading {
    font-weight: 600;
    color: #8f94a0;
    margin: 0;
    font-size: 15px;
    font-family: 'Encode Sans', sans-serif;
  }

  .charHero__btn.md-button {
    margin: 18px 0 0;
    color: white !important;
    background-color: #1c212c;
  }

  .chartList {
    padding: 0 24px;
  }

  .chartList__mainHeading {
    font-family: 'Encode Sans', sans-serif;
    margin: 0;
    padding: 30px 24px;
    font-size: 18px;
  }

  .chartlist__wrapper {
    display: flex;
    flex-wrap: wrap;
  }

  .chartlist__cardsWrapper {
    padding: 0 16px !important;
  }

  .chartTiles__wrapper {
    display: flex;
    margin-bottom: 24px;
    min-height: 246px;
  }

  .chartList__loadMore {
    display: flex;
    justify-content: center;
  }

  .chartList__loadMoreBtn {
    color: #8f94a0 !important;
    width: 120px;
  }

  .chartList__loadMoreBtn[disabled] {
    opacity: 0.2;
    pointer-events none;
  }

  .topChart__bottomSection {
    margin-bottom: 40px;
  }

</style>
