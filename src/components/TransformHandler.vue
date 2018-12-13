<template>
  <div class="transform-handler">
    <div class="anchor anchor-nw" @mousedown="onMouseDown($event, 'all', true, true)"></div>
    <div class="anchor anchor-n" @mousedown="onMouseDown($event, 'vertical', false, true)"></div>
    <div class="anchor anchor-ne" @mousedown="onMouseDown($event, 'all', false, true)"></div>
    <div class="anchor anchor-e" @mousedown="onMouseDown($event, 'horizontal', false)"></div>
    <div class="anchor anchor-se" @mousedown="onMouseDown($event, 'all')"></div>
    <div class="anchor anchor-s" @mousedown="onMouseDown($event, 'vertical')"></div>
    <div class="anchor anchor-sw" @mousedown="onMouseDown($event, 'all', true)"></div>
    <div class="anchor anchor-w" @mousedown="onMouseDown($event, 'horizontal', true)"></div>
    <div class="anchor anchor-rotate"></div>
  </div>
</template>

<script>
import throttle from '@/tools/throttle'

export default {
  props: {
    wn: {
      type: Boolean,
      default: false
    },
    n: {
      type: Boolean,
      default: false
    },
    en: {
      type: Boolean,
      default: false
    },
    e: {
      type: Boolean,
      default: false
    },
    es: {
      type: Boolean,
      default: false
    },
    s: {
      type: Boolean,
      default: false
    },
    ws: {
      type: Boolean,
      default: false
    },
    w: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      onResize: false,
      startX: 0,
      deltaX: 0,
      startY: 0,
      deltaY: 0,
      direction: 'all',
      affectLeft: false,
      affectTop: false
    }
  },
  methods: {
    onMouseDown (e, direction, affectLeft = false, affectTop = false) {
      e.stopPropagation()
      this.onResize = true
      this.direction = direction
      this.affectLeft = affectLeft
      this.affectTop = affectTop
      this.startX = e.x
      this.startY = e.y
      this.throttleResize = throttle((e) => {
        this.resize(e)
      }, 20, 20)
      document.addEventListener('mousemove', this.throttleResize)
      document.addEventListener('mouseup', this.onMouseUp)
      this.$emit('resizeStart')
    },
    onMouseUp (e) {
      e.stopPropagation()
      this.onResize = false
      this.$emit('resizeEnd')
      document.removeEventListener('mousemove', this.throttleResize)
      document.removeEventListener('mouseup', this.onMouseUp)
    },
    resize (e) {
      e.stopPropagation()
      if (this.onResize) {
        this.deltaX = e.x - this.startX
        this.deltaY = e.y - this.startY
        this.$emit('resize', {
          direction: this.direction,
          deltaX: this.deltaX,
          deltaY: this.deltaY,
          affectLeft: this.affectLeft,
          affectTop: this.affectTop
        })
      }
    }
  }
}
</script>

<style lang="less">
.transform-handler {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  .anchor {
    position: absolute;
    width: 10px;
    height: 10px;
    background: #fff;
    border: 1px solid #aaa;
    border-radius: 100%;
    box-sizing: border-box;
    &.anchor-nw {
      top: -5px;
      left: -5px;
      cursor: nwse-resize;
    }
    &.anchor-n {
      top: -5px;
      left: 50%;
      transform: translateX(-50%);
      cursor: ns-resize;
    }
    &.anchor-ne {
      top: -5px;
      right: -5px;
      cursor: nesw-resize;
    }
    &.anchor-e {
      top: 50%;
      right: -5px;
      transform: translateY(-50%);
      cursor: ew-resize;
    }
    &.anchor-se {
      bottom: -5px;
      right: -5px;
      cursor: nwse-resize;
    }
    &.anchor-s {
      bottom: -5px;
      left: 50%;
      transform: translateX(-50%);
      cursor: ns-resize;
    }
    &.anchor-sw {
      bottom: -5px;
      left: -5px;
      cursor: nesw-resize;
    }
    &.anchor-w {
      top: 50%;
      left: -5px;
      transform: translateY(-50%);
      cursor: ew-resize;
    }
    &.anchor-rotate {
      right: -15px;
      bottom: -10px;
      width: 5px;
      height: 5px;
      border: none;
      background: #aaa;
      cursor: url('../assets/images/rotate.png'), auto;
    }
  }
}
</style>
