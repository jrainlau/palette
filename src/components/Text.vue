<template>
  <div
    :class="`comp-text comp-instance ${onFocus ? 'on-focus' : ''}`"
    :style="styleObj"
    :ref="refId"
    @mousedown="dragStart">
    <div class="comp-text-content">
      {{node.content}}
    </div>
    <Transform
      v-if="onFocus"
      @resizeStart="onResizeStart"
      @resize="onResize"
      @resizeEnd="onResizeEnd" />
  </div>
</template>

<script>
import getRectInfo from '@/tools/getRectInfo'
import { megnet } from '@/tools/grid'
import throttle from '@/tools/throttle'
import Transform from '@/components/TransformHandler'

let xLock = false
let yLock = false
let lockedXValue = 0
let lockedYValue = 0
let xResizable = true
let yResizable = true

export default {
  props: {
    node: {
      type: Object
    }
  },
  data () {
    return {
      draggable: false,
      hasDragged: false,
      onFocus: true,
      posStart: {
        x: 0,
        y: 0
      },
      posEnd: {
        x: 0,
        y: 0
      },
      refId: (Math.random() * 1000000).toFixed(0),
      basicStyle: {},
      minHeight: 20,
      minWidth: 20
    }
  },
  computed: {
    styleObj () {
      return `
        width: ${this.node.width}px;
        height: ${this.node.height}px;
        line-height: ${this.node.height}px;
        top: ${this.node.y}px;
        left: ${this.node.x}px;
      `
    }
  },
  components: {
    Transform
  },
  mounted () {
    document.addEventListener('mousedown', (e) => {
      if (!this.$refs[this.refId].contains(e.target)) {
        this.onFocus = false
      }
    })
  },
  methods: {
    updateCurNodePos () {
      const { width, height, x, y } = this.node
      const nodePos = getRectInfo({ width, height, top: y, left: x })
      this.$store.dispatch('updateCurNodePos', nodePos)
    },
    dragStart (e) {
      this.updateCurNodePos()
      this.throttleOnDrag = throttle((e) => {
        this.onDrag(e)
      }, 50, 50)
      document.addEventListener('mousemove', this.throttleOnDrag)
      document.addEventListener('mouseup', this.dragEnd)
      this.draggable = true
      this.hasDragged = false
      this.onFocus = true
      this.posStart.x = e.x
      this.posStart.y = e.y
      this.$store.commit('SET_ON_DRAG', true)
    },
    onDrag (e) {
      e.stopPropagation()
      if (this.draggable) {
        const deltaX = e.x - this.posStart.x
        const deltaY = e.y - this.posStart.y
        this.node.y = this.posEnd.y + deltaY
        this.node.x = this.posEnd.x + deltaX
        this.hasDragged = true

        megnet(this.node, 5, ({ type, value }) => {
          this.node[type] = value
        })

        this.updateCurNodePos()
      }
    },
    dragEnd (e) {
      e.stopPropagation()
      this.draggable = false
      this.posEnd.x = this.node.x
      this.posEnd.y = this.node.y
      if (this.hasDragged) {
        this.$store.dispatch('updateNode', this.node)
      }
      this.$store.commit('SET_ON_DRAG', false)
      document.removeEventListener('mousemove', this.throttleOnDrag)
      document.removeEventListener('mouseup', this.dragEnd)
    },
    onResizeStart () {
      this.setBasicStyle()
    },
    onResize ({ direction, deltaX, deltaY, affectLeft, affectTop }) {
      if (this.node.width <= this.minWidth) {
        if (!xLock) {
          lockedXValue = deltaX
          xLock = true
        }
        xResizable = affectLeft ? lockedXValue - deltaX > 0 : lockedXValue - deltaX < 0
      }
      if (this.node.height <= this.minHeight) {
        if (!yLock) {
          lockedYValue = deltaY
          yLock = true
        }
        yResizable = affectTop ? lockedYValue - deltaY > 0 : lockedYValue - deltaY < 0
      }

      if (affectTop && yResizable) {
        deltaY = -deltaY
        this.node.y = this.basicStyle.top - deltaY
      }
      if (affectLeft && xResizable) {
        deltaX = -deltaX
        this.node.x = this.basicStyle.left - deltaX
      }

      if (direction === 'horizontal' && xResizable) {
        this.node.width = this.basicStyle.width + deltaX
      } else if (direction === 'vertical' && yResizable) {
        this.node.height = this.basicStyle.height + deltaY
      } else if (direction === 'all') {
        if (xResizable) {
          this.node.width = this.basicStyle.width + deltaX
        }
        if (yResizable) {
          this.node.height = this.basicStyle.height + deltaY
        }
      }

      this.updateCurNodePos()
    },
    onResizeEnd () {
      this.$store.dispatch('updateNode', this.node)
      this.posEnd.x = this.node.x
      this.posEnd.y = this.node.y
      xLock = false
      yLock = false
      lockedXValue = 0
      lockedYValue = 0
      xResizable = true
      yResizable = true
    },
    setBasicStyle () {
      this.basicStyle = {
        width: this.node.width,
        height: this.node.height,
        top: this.node.y,
        left: this.node.x
      }
    }
  }
}
</script>

<style lang="less">
.comp-text {
  text-align: center;
}
</style>
