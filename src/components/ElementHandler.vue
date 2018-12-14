<template>
  <div
    :class="`comp-text comp-instance ${onFocus ? 'on-focus' : ''}`"
    :style="styleObj"
    :ref="refId"
    @mousedown="dragStart">
    <div class="comp-text-content">
      {{node.content}}
    </div>
    <TransformHandler
      v-if="onFocus"
      @resizeStart="onResizeStart"
      @resize="onResize"
      @resizeEnd="onResizeEnd"
      @rotate="onRotate" />
  </div>
</template>

<script>
import getRectInfo from '@/tools/getRectInfo'
import { megnet } from '@/tools/grid'
import throttle from '@/tools/throttle'
import { approch, cartesian2polar } from '@/tools/math'
import TransformHandler from '@/components/TransformHandler'

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
        width: ${this.node.style.width}px;
        height: ${this.node.style.height}px;
        line-height: ${this.node.style.lineHeight}px;
        top: ${this.node.style.top}px;
        left: ${this.node.style.left}px;
        z-index: ${this.node.style.zIndex};
        border: ${this.onFocus ? '' : this.node.style.border};
        transform: rotate(${this.node.style.rotate}deg);
        color: ${this.node.style.color};
        text-align: ${this.node.style.textAlign};
      `
    }
  },
  components: {
    TransformHandler
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
      const nodePos = getRectInfo(this.node.style)
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
        this.node.style.top = this.posEnd.y + deltaY
        this.node.style.left = this.posEnd.x + deltaX
        this.hasDragged = true

        megnet(this.node, 5, ({ type, value }) => {
          this.node.style[type] = value
        })

        this.updateCurNodePos()
      }
    },
    dragEnd (e) {
      e.stopPropagation()
      this.draggable = false
      this.posEnd.x = this.node.style.left
      this.posEnd.y = this.node.style.top
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
      let hside = affectLeft ? 'left' : 'right'
      let vside = affectTop ? 'top' : 'bottom'
      this.resizeLimit(affectLeft, affectTop, deltaX, deltaY)

      if (affectTop && yResizable) {
        deltaY = -deltaY
        this.node.style.top = this.basicStyle.top - deltaY
      }
      if (affectLeft && xResizable) {
        deltaX = -deltaX
        this.node.style.left = this.basicStyle.left - deltaX
      }

      if (direction === 'horizontal' && xResizable) {
        this.node.style.width = this.basicStyle.width + deltaX
      } else if (direction === 'vertical' && yResizable) {
        this.node.style.height = this.basicStyle.height + deltaY
      } else if (direction === 'all') {
        if (xResizable) {
          this.node.style.width = this.basicStyle.width + deltaX
        }
        if (yResizable) {
          this.node.style.height = this.basicStyle.height + deltaY
        }
      }

      megnet(this.node, 5, ({ type, value, gridLine }) => {
        if (type === 'x' && hside === 'right') {
          this.node.style.width = gridLine - this.node.style.left
        } else if (type === 'x' && hside === 'left') {
          const xGap = this.node.style.left - gridLine
          this.node.style.left = gridLine
          this.node.style.width += xGap
        } else if (type === 'y' && vside === 'bottom') {
          this.node.style.height = gridLine - this.node.style.top
        } else if (type === 'y' && vside === 'top') {
          const yGap = this.node.style.top - gridLine
          this.node.style.top = gridLine
          this.node.style.height += yGap
        }
      }, hside, vside)

      this.updateCurNodePos()
    },
    onResizeEnd () {
      this.$store.dispatch('updateNode', this.node)
      this.posEnd.x = this.node.style.left
      this.posEnd.y = this.node.style.top
      xLock = false
      yLock = false
      lockedXValue = 0
      lockedYValue = 0
      xResizable = true
      yResizable = true
    },
    onRotate ({ deltaX, deltaY }) {
      const [x, y] = [deltaX + 100, -deltaY]
      let rotateRate = 360 - cartesian2polar(x, y)
      this.node.style.rotate = rotateRate + this.basicStyle.rotate
      if (this.node.style.rotate > 360) {
        this.node.style.rotate = this.node.style.rotate - 360
      }
      ;[0, 45, 90, 135, 180, 225, 270, 315].forEach(angle => {
        if (approch(this.node.style.rotate, angle)) {
          this.node.style.rotate = angle
        }
      })
      this.updateCurNodePos()
    },
    setBasicStyle () {
      this.basicStyle = {
        width: this.node.style.width,
        height: this.node.style.height,
        top: this.node.style.top,
        left: this.node.style.left,
        rotate: this.node.style.rotate
      }
    },
    resizeLimit (affectLeft, affectTop, deltaX, deltaY) {
      if (this.node.style.width <= this.minWidth) {
        if (!xLock) {
          lockedXValue = deltaX
          xLock = true
        }
        xResizable = affectLeft ? lockedXValue - deltaX > 0 : lockedXValue - deltaX < 0
      }
      if (this.node.style.height <= this.minHeight) {
        if (!yLock) {
          lockedYValue = deltaY
          yLock = true
        }
        yResizable = affectTop ? lockedYValue - deltaY > 0 : lockedYValue - deltaY < 0
      }
    }
  }
}
</script>
