<template>
  <div class="grid">
    <canvas ref="canvas" width="960" height="700"></canvas>
  </div>
</template>

<script>
import { drawGrid, highlight, resetGrid } from '@/tools/grid'
import { mapState } from 'vuex'

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
      canvas: null,
      context: null
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
      const { elTop, elLeft, elRight, elBottom, centre } = val
      highlight(this.context, this.stepX, this.stepY, elLeft, elBottom, elRight, elTop, centre.x, centre.y)
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
