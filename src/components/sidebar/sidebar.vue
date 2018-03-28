<template lang="jade">
  aside.sidebar
    .sidebar__Inner
      .sidebar__Header
        .left
          md-icon library_music
          span Playlists
        .right(v-if="isContentLoaded")
          md-button.md-icon-button(@click="prevChart" v-bind:disabled="currentPlaylistsPage == 1")
            md-icon keyboard_arrow_left
          md-button.md-icon-button(@click="nextChart" v-bind:disabled="!hasPlaylistsNextPage || state.loadingMore")
            md-icon keyboard_arrow_right
      .charts
        .chart__list(v-if="!isContentLoaded")
          sidebar-playlist-placeholder(
          v-for="(item, index) in Array.from({ length: 8 })"
          v-bind:key="index")
        .chart__list(v-if="isContentLoaded")
          .chart(v-for="playlist in displayedPlaylists"  v-on:click="navigateTo('playlist',playlist.id)")
            .chart__cover(
            v-bind:style="{ backgroundImage: 'url(' + playlist.picture + ')' }")
            .chart__meta
              .chart__title {{playlist.title}}
              .chart__user by {{playlist.user.name}}
              .chart__user {{playlist.nb_tracks}} tracks
      .sidebar__Header(v-if="isContentLoaded")
        .left
          md-icon mic
          span Artists
        .right
          md-button.md-icon-button(@click="prevArtists" v-bind:disabled="currentArtistsPage == 1")
            md-icon keyboard_arrow_left
          md-button.md-icon-button(@click="nextArtists" v-bind:disabled="!hasArtistsNextPage || state.loadingMore")
            md-icon keyboard_arrow_right
      .artists(v-if="isContentLoaded")
        .artist__list
          .artist(v-for="artist in displayedArtists"  v-on:click="navigateTo('artist',artist.id)")
            .artist__cover(
            v-bind:style="{ backgroundImage: 'url(' + artist.picture + ')' }")
            .artist__title {{artist.name}}
      .sidebar__Header(v-if="isContentLoaded")
        .left
          md-icon headset
          span Genres
      .asideGenres
        .asideGenres__list(v-if="isContentLoaded")
          .genreItem(v-for="genre in genres"  v-on:click="navigateTo('genre',genre.id);$store.dispatch('setCurrentPlaylistName', genre.name)")
            .asideGenres__title {{genre.name}}
</template>

<script>
import Vue from 'vue';
import Component from 'vue-class-component';
import { State } from 'vuex-class';
import SidebarPlaylistPlaceholder from './sidebar.playlist.placeholder.vue';

@Component({
  components: {
    'sidebar-playlist-placeholder': SidebarPlaylistPlaceholder,
  },
})
export default class Sidebar extends Vue {
  MAX_PLAYLSITS_COUNT_ON_PAGE = 8;
  MAX_ARTISTS_COUNT_ON_PAGE = 12;
  MAX_GENRES_COUNT_ON_PAGE = 9;
  currentPlaylistsPage = 1;
  currentArtistsPage = 1;
  currentTime = 0;

  @State(state => state.sidebar)
  state;

  @State(state => state.genres)
  genresState;

  get isContentLoaded() {
    return this.genres.length && this.state.playlists.length;
  }

  loadMore() {
    if (!this.state.loadingMore && this.state.hasMore) {
      this.$store.dispatch('sidebarLoadMore');
    }
  }

  get displayedPlaylists() {
    if (!this.state.playlists || !this.state.playlists.length) {
      return [];
    }
    const startIndex =
      (this.currentPlaylistsPage - 1) * this.MAX_PLAYLSITS_COUNT_ON_PAGE;
    const endIndex = startIndex + this.MAX_PLAYLSITS_COUNT_ON_PAGE;
    return this.state.playlists.slice(startIndex, endIndex);
  }

  get hasPlaylistsNextPage() {
    const res =
      this.MAX_PLAYLSITS_COUNT_ON_PAGE * (this.currentPlaylistsPage + 1) <
      this.state.playlists.length;
    if (!res) {
      this.loadMore();
    }
    return res;
  }

  get displayedArtists() {
    if (!this.state.artists || !this.state.artists.length) {
      return [];
    }
    const startIndex =
      (this.currentArtistsPage - 1) * this.MAX_ARTISTS_COUNT_ON_PAGE;
    const endIndex = startIndex + this.MAX_ARTISTS_COUNT_ON_PAGE;
    return this.state.artists.slice(startIndex, endIndex);
  }

  get hasArtistsNextPage() {
    const res =
      this.MAX_ARTISTS_COUNT_ON_PAGE * (this.currentArtistsPage + 1) <
      this.state.artists.length;
    if (!res) {
      this.loadMore();
    }
    return res;
  }

  get genres() {
    if (!this.genresState.genres.length) {
      return [];
    }
    return this.genresState.genres.slice(1, this.MAX_GENRES_COUNT_ON_PAGE + 1);
  }

  nextChart() {
    this.currentPlaylistsPage += 1;
  }

  prevChart() {
    if (this.currentPlaylistsPage <= 1) {
      return;
    }
    this.currentPlaylistsPage -= 1;
  }

  nextArtists() {
    this.currentArtistsPage += 1;
  }

  prevArtists() {
    if (this.currentArtistsPage <= 1) {
      return;
    }
    this.currentArtistsPage -= 1;
  }

  navigateTo(type, id) {
    this.$router.push({
      name: 'play',
      params: { type, id },
    });
  }

  mounted() {
    if (!this.state.playlists.length) {
      this.$store.dispatch('fetchDataForSidebar', {
        perPage: 60,
        page: 1,
      });
    }
    if (!this.genres || !this.genres.length) {
      this.$store.dispatch('fetchAllGenreData');
    }
  }
}
</script>

<style lang="stylus" scoped>
  .sidebar {
    padding: 14px 16px 18px;
    display: flex;
    flex-direction: column;
    flex: 5;
    min-width: 0;
    height: 100%;
  }

  .sidebar__Header {
    font-size: 14px;
    margin-bottom: 12px;
    font-weight: 900;
    height: 46px;
    max-height: 46px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .md-icon {
      color: #565c69 !important
    }

    .left {
      .md-icon {
        font-size: 16px;
        margin-right: 8px;
      }

      color: rgb(86, 92, 105);
      font-weight: 900;
      text-transform: uppercase;
      align-items: center;
      display: flex;
    }

    .right {
      font-size: 10px;
      text-transform: uppercase;
      color: #999;
    }
  }

  .sidebar__Inner {
    display: flex;
    flex-direction: column;
    width: 100%;
    transform: translateZ(0);
    position: sticky;
    top: calc(-1300px + 100vh);

    .md-button[disabled]{
      opacity: 0.3 !important
    }
  }

  .asideGenres__list {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    margin-bottom: 14px;
  }

  .genreItem {
    display: flex;
    padding: 0 12px;
    flex-direction: row;
    margin-bottom: 8px;
    margin-right: 10px;
    min-height: 45px;
    cursor: pointer;
    max-width: 154px;
    width: 154px;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: relative;
    background-color: #1c212c;
    border-radius: 0;
    transition: all 350ms ease-in-out;

    &:hover {
      opacity: 0.6;
    }
  }

  .asideGenres__title {
    font-size: 13px;
    font-family: 'Encode Sans', sans-serif;
    color: white;
    position: relative;
    z-index: 10;
    font-weight: 900;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 100%;
    display: block;
  }

  .chart__list {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    margin-bottom: 14px;
  }

  .chart {
    display: flex;
    flex-direction: row;
    margin-bottom: 16px;
    margin-right: 10px;
    min-height: 60px;
    cursor: pointer;
    min-width: 220px;
    width: 220px;
    max-width: 220px;
    overflow: hidden;
    position: relative;
    transition: opacity 120ms ease

    &:hover {
      opacity: 0.8;
    }
  }

  .chart__cover {
    height: 78px;
    max-height: 78px;
    min-height: 78px;
    width: 78px;
    min-width: 78px;
    max-width: 78px;
    background-size: cover;
    border-radius: 4px;
    background-color: #1c212c
    transition: all 300ms ease-in-out
  }

  .chart__meta {
    padding-left: 12px;
  }

  .chart__title {
    font-size: 14px;
    padding-bottom: 2px;
    color: #eee;
    font-weight: bold;
    max-width: 100%;
  }

  .chart__user {
    font-size: 12px;
    color: rgb(86, 92, 105);
    font-weight: bold;
    line-height: 1.3;
  }

  .artist__list {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
  }

  .artist {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 16px;
    margin-right: 0;
    min-height: 60px;
    max-width: 120px;
    width: 120px;
    cursor: pointer;
    overflow: hidden;
    position: relative;

    &:hover {
      opacity: 0.9;
    }
  }

  .artist__cover {
    height: 76px;
    max-height: 76px;
    min-height: 76px;
    width: 76px;
    min-width: 76px;
    max-width: 76px;
    background-size: cover;
    border-radius: 50%;
  }

  .artist__title {
    font-size: 12px;
    padding-bottom: 2px;
    padding-top: 12px;
    color: #eee;
    font-weight: bold;
    max-width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>
