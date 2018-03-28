<template lang="jade">
  .search
    .search__inputContainer
      input(type="text" placeholder="Search" v-model="searchQuery" v-on:keyup.enter="onPressEnter" @input="onChange").search__input

</template>

<script>
import Vue from 'vue';
import Component from 'vue-class-component';
import debounce from 'lodash.debounce';

@Component()
export default class Search extends Vue {
  searchQuery = '';
  previousQuery = '';
  minCharCounter = 1;

  onChange = debounce(event => {
    let searchValue = event.target.value;
    if (!searchValue) {
      if (this.previousQuery) {
        this.$store.dispatch('clearSearch');
        this.$store.dispatch('closeSearch');
      }
      return;
    }
    if (searchValue === this.previousQuery) {
      return;
    }
    if (searchValue.length <= this.minCharCounter) {
      this.$store.dispatch('clearSearch');
      this.$store.dispatch('closeSearch');
      return;
    }
    this.previousQuery = searchValue;
    this.$store.dispatch('startSearch', searchValue);
    this.$store.dispatch('openSearchPanel');
  }, 350);

  onPressEnter() {
    if (!this.searchQuery || this.searchQuery < this.minCharCounter) {
      return;
    }
    this.$store.dispatch('startSearch', this.searchQuery);
    this.$store.dispatch('openSearchPanel');
  }
}
</script>

<style lang="stylus">
  .search {
    display: flex;
    width: 50%;
    max-width: 520px;
    height: 36px;
    border-radius: 6px;
  }

  .search__inputContainer {
    width: 100%;
  }

  .search__input {
    width: 100%;
    padding: 10px 12px;
    border-radius: 3px;
    border: none;
    outline: none;
    height: 100%;
    background: rgba(255, 255, 255, 0.04);
    color: white;
    font-weight: 500;
    font-size: 16px;
    text-align: center;
    transition: all 350ms ease-in-out;
    &::-webkit-input-placeholder {
      color: rgba(255, 255, 255, 0.15);
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
      position: relative;
      top: -2px;
    }
    &::-moz-placeholder {
      color: rgba(255, 255, 255, 0.15);
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
      position: relative;
      top: -2px;
    }
    &:focus {
      background-color: white;
      color: black;
      &::-webkit-input-placeholder {
        display: none;
      }
      &::-moz-placeholder {
        display: none;
      }
    }
  }
</style>
