<template lang="jade">
  section.genres
    figure.genreCard(
      v-for="genre in genres"
      v-on:click="navigateTo('genre', genre.id);$store.dispatch('setCurrentPlaylistName', genre.name)")
      .genreCard__bgHolder(v-bind:style="{ backgroundImage: 'url(' + genre.imageCover + ')' }")
      .genreCard__bgCover
      .genreCard__meta
        .genreCard__name {{genre.name}}
      .genreCard__artists
        .genreCard__artist(
            v-if="genre.artists"
            v-for="artist in genre.artists"
            v-on:click.stop="navigateTo('artist', artist.id)")
          .genreCard__artistPicture(v-bind:style="{ backgroundImage: 'url(' + artist.picture_medium + ')' }")
          .genreCard__artistName {{artist.name}}
</template>

<script>
import Vue from 'vue';
import Component from 'vue-class-component';
import { State, Getter } from 'vuex-class';

const coversMap = {
  132: './images/pop.jpg',
  152: './images/rock.jpg',
  113: './images/dance.jpg',
  165: './images/rnb.jpg',
  116: './images/rap.jpg',
  85: './images/alternative.jpg',
  106: './images/electro.jpg',
  466: './images/folk.jpg',
  144: './images/reggae.jpg',
};

@Component()
export default class HomePage extends Vue {
  @State(state => state.genres.genresArtist)
  genresArtist;
  @Getter('genreList') genreList;

  get genres() {
    return this.genreList.slice(0, 9).map(item => ({
      ...item,
      imageCover: coversMap[item.id] || item.picture_big,
      artists: this.genresArtist[item.id]
        ? this.genresArtist[item.id].slice(0, 6)
        : [],
    }));
  }

  created() {
    if (!this.genreList || !this.genreList.length) {
      this.$store.dispatch('fetchAllGenreData');
    }
  }

  navigateTo(type, id) {
    this.$router.push({
      name: 'play',
      params: { type, id },
    });
  }
}
</script>

<style lang="stylus">
  .genres {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-auto-rows: minmax(60px, auto)
  }

  .genreCard {
    margin: 0;
    position: relative;
    cursor: pointer;

    &:after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 100%;
      background-image: linear-gradient(to bottom, rgba(28, 33, 44, 0.7) 0, rgba(28, 33, 44, 1) 100%)
      opacity: 1;
      transition: opacity 0.6s;
    }

    &:hover:after {
      opacity: 0.9;
    }
  }

  .genreCard:nth-child(2) {
    grid-column: span 2;
    grid-row: span 6;
  }

  .genreCard:nth-child(1),
  .genreCard:nth-child(3),
  .genreCard:nth-child(4),
  .genreCard:nth-child(5),
  .genreCard:nth-child(6),
  .genreCard:nth-child(8),
  .genreCard:nth-child(9) {
    grid-column: span 2;
    grid-row: span 7;
  }

  .genreCard:nth-child(7) {
    grid-column: span 2;
    grid-row: span 8;
  }

  .genreCard__bgHolder {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
  }

  .genreCard__bgCover {
    display: none
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

  .genreCard__meta {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 30px;
    right: 22px;
    z-index: 10;
  }

  .genreCard__name {
    color: white;
    font-size: 22px;
    font-weight: 500;
  }

  .genreCard__artists {
    position: absolute;
    z-index 10
    bottom: 12px;
    right: 0;
    width: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .genreCard__artist {
    display: flex;
    height: 34px;
    align-items center
    padding: 0 12px;
    &:hover .genreCard__artistName{
      color: white;
    }
  }

  .genreCard__artistPicture {
    width: 28px;
    height: 28px;
    margin-right: 8px;
    border-radius 50%;
    overflow hidden
    background-repeat no-repeat
    background-position center
    background-size: cover
  }

  .genreCard__artistName {
    color: #8f94a0
    font-size 11px
    font-weight bold
    transition: all 120ms ease
  }

</style>
