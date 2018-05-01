<template lang="jade">
  header.header
    .header__inner
      .header__left
        router-link(to="/")
          .logo
        .header__buttons
          router-link(to="/play")
            md-button Play
          router-link(to="/genres")
            md-button Genres
      header-search
      .header__right
        md-menu(md-direction='bottom-start' v-if="userState.isLoggedIn")
          .userBlock(md-menu-trigger='')
            span.userBlock__name  {{userState.userInfo.name}}
            .userBlock__avatar(v-bind:style="{ backgroundImage: 'url(' + userState.userInfo.picture + ')' }")
          md-menu-content
            md-menu-item(class="headerMenuItem" @click="logout()") Logout

        md-button(v-else class="headerButton" @click="login()") Login

      transition(name="fade")
        header-search-result(v-if="isOpened" ref="searchResults" v-bind:items="items" v-bind:isLoading="processing")

</template>

<script>
import Vue from 'vue';
import Component from 'vue-class-component';
import { State } from 'vuex-class';
import HeaderSearch from './search/search.vue';
import HeaderSearchResult from './search/search.panel.vue';
import { Watch } from 'vue-property-decorator';


@Component({
  components: {
    'header-search': HeaderSearch,
    'header-search-result': HeaderSearchResult,
  },
})
export default class Header extends Vue {
  @State(state => state.search.isOpened)
  isOpened;
  @State(state => state.search.processing)
  processing;
  @State(state => state.search.searchResults)
  items;

  @State(state => state.user)
  userState;

  @Watch('$route')
  routeChanged() {
    console.log('THIS HERE -> ', this.$route.name)
  }

  openSearch() {
    this.$store.dispatch('startSearch');
  }

  login() {
    this.$store.dispatch('login');
  }

  logout() {
    this.$store.dispatch('logout');
  }

  closeSearch() {
    this.$store.dispatch('closeSearch');
  }
}
</script>

<style lang="stylus">
  .header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100;
    display: flex;
    height: 60px;
    justify-content: space-between;
    align-items: center;
    background: transparent;
    transform: translateZ(0);
    perspective: 600;
  }

  .header__inner {
    position: relative;
    width: 100%;
    max-width: 1092px;
    min-width: 1092px;
    padding: 0 16px;
    box-shadow: rgba(41, 41, 41, 0.2) 0px 1px 3px 0px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 2px 1px -1px;
    margin: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #1c212c;
  }

  .header__left {
    display: flex;
    align-items: center;
  }

  .logo {
    background-image: url('../../assets/logo.png');
    background-repeat: no-repeat;
    width: 120px;
    display: inline-block;
    height: 60px;
    vertical-align: middle;
    background-position: center;
    cursor: pointer;
  }

  .header__buttons {
    display: flex;
    margin-left: 20px;
  }

  .headerButton,
  .header__buttons .md-button, .header__buttons .md-button .md-ink-ripple {
    border-radius: 0 !important;
    color: white;
  }

  .fade-enter-active, .fade-leave-active {
    transition: all 0.4s;
    transform: rotateX(0);
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
    transform: rotateX(15deg);
  }

  .userBlock {
    display: flex
    align-items center
    font-size 13px
    font-weight 500
    cursor pointer

  }
  .userBlock__avatar {
    width: 32px;
    height 32px
    margin-left 10px
    border-radius 50%
    background-size cover
    background-position center
    background-repeat no-repeat
  }

  .md-menu-content{
    z-index 300
    background-color: #242a38
  }
  .headerMenuItem{
    color: white
  }
  .md-list-item-content{
    color: white
  }
  .header__buttons .router-link-active .md-button{
    background-color: rgba(255,255,255,0.1)
  }
</style>
