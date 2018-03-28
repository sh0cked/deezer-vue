<template lang="jade">
  .sidebarPlaylistPlaceholder
    .sidebarPlaylistPlaceholder__left
      animated-placeholder(
        width="78"
        height="78")
    .sidebarPlaylistPlaceholder__right
      animated-placeholder(
        width="120"
        height="15"
        v-bind:style="{'margin': '0 0 6px 0'}")
      animated-placeholder(
        width="120"
        height="12"
        v-bind:style="{'margin': '0 0 4px 0'}")
</template>

<script>
import Vue from 'vue';
import Component from 'vue-class-component';

@Component()
export default class SidebarPlaylistPlaceholder extends Vue {}
</script>

<style lang="stylus">
  .sidebarPlaylistPlaceholder {
    width: 230px;
    height: 78px;
    display flex
    margin-bottom 16px;
  }
  .sidebarPlaylistPlaceholder__right {
    display flex
    flex-direction column
    padding-left 12px
  }
</style>
