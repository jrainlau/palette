<template>
  <div class="grid">
    <canvas ref="canvas" width="960" height="700"></canvas>
  </div>
</template>

<script>
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
  mounted () {
    const canvas = this.$refs.canvas
    const context = canvas.getContext('2d')

    function drawGrid (context, color, stepx, stepy) {
      context.strokeStyle = color
      context.lineWidth = 0.5

      for (let i = stepx + 0.5; i < context.canvas.width; i += stepx) {
        context.beginPath()
        context.moveTo(i, 0)
        context.lineTo(i, context.canvas.height)
        context.stroke()
      }
      for (let i = stepy + 0.5; i < context.canvas.height; i += stepy) {
        context.beginPath()
        context.moveTo(0, i)
        context.lineTo(context.canvas.width, i)
        context.stroke()
      }
    }

    drawGrid(context, this.color, this.stepX, this.stepY)
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
