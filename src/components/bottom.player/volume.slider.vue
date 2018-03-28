<template lang="jade">
  .volumeSlider(@mouseup="onMouseUp"
    @mousedown="onMouseDown"
      @mouseleave="onMouseLeave"
      @mousemove="onMouseMove")
    .volumeSlider__lineWrapper
      .volumeSlider__bgLine
      .volumeSlider__currentLine(v-bind:style="{'height': volume + '%'}")
      .volumeSlider__ball(v-bind:style="{'bottom': volume + '%'}")

</template>

<script>
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  props: {
    volume: Number,
  },
})
export default class BottomVolumeSlider extends Vue {
  mouseDown = false;

  onMouseUp(event) {
    if (this.mouseDown) {
      this.$emit('volumeChanged', this.getVolPercent(event));
    }
    this.mouseDown = false;
  }

  onMouseDown(event) {
    this.mouseDown = true;
    this.$emit('volumeChanged', this.getVolPercent(event));
  }

  onMouseMove(event) {
    if (!this.mouseDown) {
      return;
    }
    this.$emit('volumeChanged', this.getVolPercent(event));
  }

  onMouseLeave() {
    this.mouseDown = false;
  }

  getVolPercent(event) {
    const { top, bottom } = this.$el.getBoundingClientRect();
    const { clientY } = event;
    if (clientY <= top) {
      return 100;
    }
    if (clientY >= bottom) {
      return 0;
    }

    const lineHeight = this.$el.clientHeight;
    const vol = 100 - (clientY - top) / lineHeight * 100;
    if (vol <= 5.5) {
      // Fixme Calculate precisely ball and volume position
      return 0;
    }
    return vol;
  }
}
</script>

<style lang="stylus" scoped>

  .volumeSlider {
    display: block;
    position: absolute;
    top: -144px;
    left: 0;
    right: 0;
    width: 100%;
    height: 146px;
    background-color: #1c212c;
    border-radius 3px
  }

  .volumeSlider__lineWrapper {
    height: 128px;
    position: absolute;
    left: 50%;
    margin-left: -1px;
    bottom: 8px;

  }

  .volumeSlider__bgLine {
    width: 2px;
    background-color: #979797;
    height: 100%;
  }

  .volumeSlider__ball {
    width: 10px;
    height: 10px;
    background-color: yellow;
    border-radius: 50%;
    overflow: hidden;
    position: absolute;
    bottom: 30%;
    margin-left: -4px;
    margin-bottom: -8px;
  }

  .bottomPlayer__sliderWrapper {
    display: block;
    position: absolute;
    top: -150px;
    left: 0;
    right: 0;
    width: 100%;
    height: 146px;
    background-color: #1c212c;
    border-radius 3px
  }

  .volumeSlider__currentLine {
    height: 30px;
    background-color: yellow;
    bottom: 0;
    position: absolute;
    width: 100%;
  }

</style>
