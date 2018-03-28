<template lang="jade">
  .spinner
    .rect1
    .rect2
    .rect3
    .rect4
    .rect5

</template>

<script>
import Vue from 'vue';
import Component from 'vue-class-component';

@Component()
export default class Spinner extends Vue {}
</script>

<style lang="stylus">
  .spinner {
    margin: 100px auto;
    width: 50px;
    height: 20px;
    text-align: center;
    font-size: 10px;
  }

  .spinner > div {
    background-color: #fff;
    height: 100%;
    width: 3px;
    margin: 1px
    display: inline-block;
    animation: sk-stretchdelay 1.2s infinite ease-in-out;
  }

  .spinner .rect2 {
    -webkit-animation-delay: -1.1s;
    animation-delay: -1.1s;
  }

  .spinner .rect3 {
    -webkit-animation-delay: -1s;
    animation-delay: -1s;
  }

  .spinner .rect4 {
    -webkit-animation-delay: -0.9s;
    animation-delay: -0.9s;
  }

  .spinner .rect5 {
    -webkit-animation-delay: -0.8s;
    animation-delay: -0.8s;
  }

  @keyframes sk-stretchdelay {
    0%,
    40%,
    100% {
      transform: scaleY(0.4);
      -webkit-transform: scaleY(0.4);
    }
    20% {
      transform: scaleY(1);
      -webkit-transform: scaleY(1);
    }
  }
</style>
