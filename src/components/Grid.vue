<template>
  <div class="grid">
    <canvas
      ref="canvas"
      width="960" height="700"
      @mousedown="onDragStart"
      @mousemove="onDragging"
      @mouseup="onDragEnd">
    </canvas>
  </div>
</template>

<script>
import { drawGrid, highlight, resetGrid, drawRect } from '@/tools/grid'
import { mapState } from 'vuex'
import { throttle } from 'lodash'

export default {
  props: {
    color: {
      type: String,
      default: 'lightgrey'
    },
    stepX: {
      type: Number,
      default: 80
    },
    stepY: {
      type: Number,
      default: 70
    }
  },
  data () {
    return {
      throttle,
      canvas: null,
      context: null,
      draggable: false,
      startX: 0,
      startY: 0
    }
  },
  computed: {
    ...mapState(['nodePos', 'onDrag'])
  },
  mounted () {
    this.canvas = this.$refs.canvas
    this.context = this.canvas.getContext('2d')
    drawGrid(this.context, this.stepX, this.stepY)
    document.addEventListener('mouseup', () => {
      setTimeout(() => {
        resetGrid(this.context, this.stepX, this.stepY)
      }, 100)
    })
  },
  watch: {
    nodePos (val) {
      const { elTop, elLeft, elRight, elBottom, centre, rotate } = val
      highlight(this.context, this.stepX, this.stepY, elLeft, elBottom, elRight, elTop, centre.x, centre.y, rotate)
    }
  },
  methods: {
    onDragStart (e) {
      this.draggable = true
      this.startX = e.offsetX
      this.startY = e.offsetY
    },
    onDragging: throttle(function (e) {
      if (this.draggable) {
        const [deltaX, deltaY] = [e.offsetX - this.startX, e.offsetY - this.startY]
        drawRect(this.context, this.stepX, this.stepY, this.startX, this.startY, deltaX, deltaY)
        this.$store.commit('SET_SELECT_AREA', {
          top: this.startY,
          left: this.startX,
          width: deltaX,
          height: deltaY
        })
      }
    }, 20),
    onDragEnd (e) {
      this.draggable = false
      this.startX = 0
      this.startY = 0
    }
  }
}
</script>

<style lang="less">
.grid {
  position: absolute;
  width: 960px;
  height: 700px;
  overflow: hidden;
  border: 0.5px solid lightgrey;
}
</style>
