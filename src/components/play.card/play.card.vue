<template lang="jade">
  figure.playCard(v-on:click="onCardClick($event)")
    .playCard__inner(v-if='isReady')
      .playCard__cover(v-bind:style="{ backgroundImage: 'url(' + image + ')' }")
      figcaption.playCard__meta
        .playCard__title {{header}}
        .playCard__artist(v-if="artist")
          img(v-bind:src="artist.image").playCard__artistPicture
          .playCard__artistName {{artist.name}}
</template>

<script>
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  props: {
    id: [String, Number],
    type: String,
    image: String,
    header: String,
    artist: Object,
  },
})
export default class PlayCard extends Vue {
  get isReady() {
    return Boolean(this.$props.image && this.$props.header);
  }

  onCardClick() {
    if (!this.isReady) {
      return;
    }
    this.$emit('onCardClick', {
      type: this.type,
      id: this.id,
    });
  }
}
</script>

<style lang="stylus">
  .playCard {
    width: 160px;
    min-height: 230px;
    display: flex;
    flex-direction: column;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.05);
    position: relative;
    margin: 10px 8px 14px;
    cursor: pointer;
    background-color: #1c212c;

    &:hover {
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);
    }
  }

  .playCard__inner {
    display: flex;
    flex-direction: column;
    flex: 1;
    width: 100%;
  }

  .playCard__cover {
    width: 100%;
    height: 160px;
    flex: none;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position relative
  }

  .playCard__meta {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 68px;
  }

  .playCard__title {
    font-size: 14px;
    font-weight: bold;
    margin-top: auto;
    margin-bottom: auto;
    max-height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    line-height: 1.4;
    padding: 20px 0;
    text-align: center;
    font-family: 'Encode Sans', sans-serif;
  }

  .playCard__artist {
    display: flex;
    height: 46px;
    align-items: center;
    padding: 8px;
    margin-top: auto;
  }

  .playCard__artistPicture {
    height: 34px;
    width: 34px;
    margin-right: 12px;
    border-radius: 50%;
    overflow: hidden;
  }

  .playCard__artistName {
    font-size: 12px;
    font-weight: 700;
    color: #565c69;
    min-width: 0;
    flex: 1;
    line-height: 1.2;
  }

</style>
