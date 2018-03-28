<template>
  <div class="placeholder" v-bind:style="{width: `${width}px`, height: `${height}px`}"></div>
</template>

<script>
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  props: {
    width: String,
    height: String,
  },
})
export default class AnimatedPlaceholder extends Vue {}
</script>

<style lang="stylus">
  @keyframes placeHolderAnimation {
    0% {
      background-position: -1100px 0;
    }

    100% {
      background-position: 1100px 0;
    }
  }

  .placeholder {
    width: 120px;
    height: 200px;
    display: flex;
    border-radius: 4px;
    overflow: hidden;
    animation-duration: 2s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-name: placeHolderAnimation;
    animation-timing-function: linear;
    background: #1c212c;
    background: linear-gradient(to right, #1c212c 8%, #242a38 18%, #1c212c 33%);
    background-size: 1100px 404px;
    position: relative;
  }
</style>
