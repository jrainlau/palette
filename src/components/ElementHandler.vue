<template>
  <div
    :class="`comp-text comp-instance ${node.onFocus ? 'on-focus' : ''}`"
    :style="styleObj"
    :ref="refId"
    @mousedown="dragStart"
    @dblclick="onDbClick">
    <div class="comp-text-content">
      <slot></slot>
    </div>
    <TransformHandler
      v-if="node.onFocus"
      @resizeStart="onResizeStart"
      @resize="onResize"
      @resizeEnd="onResizeEnd"
      @rotate="onRotate" />
  </div>
</template>

<script>
import getRectInfo from '@/tools/getRectInfo'
import { megnet } from '@/tools/grid'
import { throttle } from 'lodash'
import { approch, cartesian2polar } from '@/tools/math'
import TransformHandler from '@/components/TransformHandler'
import { mapState } from 'vuex'

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
      refId: (Math.random() * 1000000).toFixed(0),
      basicStyle: {},
      minHeight: 20,
      minWidth: 20
    }
  },
  computed: {
    ...mapState({
      selectArea: state => state.selectArea,
      nodes: state => state.pages[state.currentPage] && state.pages[state.currentPage].nodes
    }),
    styleObj () {
      return `
        width: ${this.node.style.width}px;
        height: ${this.node.style.height}px;
        line-height: ${this.node.style.height}px;
        top: ${this.node.style.top}px;
        left: ${this.node.style.left}px;
        z-index: ${this.node.style.zIndex};
        border: ${this.node.onFocus ? '' : this.node.style.border};
        transform: rotate(${this.node.style.rotate}deg);
        color: ${this.node.style.color};
        text-align: ${this.node.style.textAlign};
      `
    }
  },
  watch: {
    selectArea ({ top, left, width, height }) {
      const rangeStatus = (
        // nw
        (top < this.node.style.top + this.node.style.height / 2 &&
        left < this.node.style.left + this.node.style.width / 2 &&
        top + height > this.node.style.top + this.node.style.height / 2 &&
        left + width > this.node.style.left + this.node.style.width / 2) ||
        // ne
        (top < this.node.style.top + this.node.style.height / 2 &&
        left > this.node.style.left + this.node.style.width / 2 &&
        top + height > this.node.style.top + this.node.style.height / 2 &&
        left + width < this.node.style.left + this.node.style.width / 2) ||
        // sw
        (top > this.node.style.top + this.node.style.height / 2 &&
        left < this.node.style.left + this.node.style.width / 2 &&
        top + height < this.node.style.top + this.node.style.height / 2 &&
        left + width > this.node.style.left + this.node.style.width / 2) ||
        // se
        (top > this.node.style.top + this.node.style.height / 2 &&
        left > this.node.style.left + this.node.style.width / 2 &&
        top + height < this.node.style.top + this.node.style.height / 2 &&
        left + width < this.node.style.left + this.node.style.width / 2)
      )
      if (!this.node.groupId) {
        this.node.onFocus = this.node.selectByRange = rangeStatus
      } else {
        this.nodes.forEach(node => {
          if (node.groupId === this.node.groupId) {
            node.onFocus = node.selectByRange = rangeStatus
          }
        })
      }
    }
  },
  components: {
    TransformHandler
  },
  mounted () {
    document.addEventListener('mousedown', (e) => {
      if (
        (!this.$refs[this.refId].contains(e.target) && !this.node.selectByRange) ||
        e.target.nodeName === 'CANVAS'
      ) {
        this.node.onFocus = this.node.selectByRange = false
      }
    })
  },
  methods: {
    updateCurNodePos () {
      const nodePos = getRectInfo(this.node.style)
      this.$store.commit('UPDATE_CUR_NODE_POS', nodePos)
    },
    dragStart (e) {
      this.updateCurNodePos()
      document.addEventListener('mousemove', this.onDrag)
      document.addEventListener('mouseup', this.dragEnd)
      this.draggable = true
      this.hasDragged = false
      this.node.onFocus = true
      this.$store.commit('SELECT_AS_GROUP', { groupId: this.node.groupId, val: true })
      this.node.posStart.x = e.x
      this.node.posStart.y = e.y
      this.$store.commit('SET_ON_DRAG', true)
    },
    onDrag: throttle(function (e) {
      e.stopPropagation()
      if (this.draggable) {
        const deltaX = e.x - this.node.posStart.x
        const deltaY = e.y - this.node.posStart.y
        this.$store.commit('UPDATE_NODE_POS', {
          deltaY,
          deltaX
        })

        this.hasDragged = true

        megnet(this.node, 5, ({ type, value }) => {
          const distance = value - this.node.style[type]
          this.nodes.map(node => {
            if (node.onFocus) {
              node.style[type] += distance
            }
          })
        })

        this.updateCurNodePos()
      }
    }, 50),
    dragEnd (e) {
      e.stopPropagation()
      this.draggable = false
      this.$store.commit('SET_NODE_POSEND')
      this.$store.commit('SET_ON_DRAG', false)
      document.removeEventListener('mousemove', this.onDrag)
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
        if (type === 'left' && hside === 'right') {
          this.node.style.width = gridLine - this.node.style.left
        } else if (type === 'left' && hside === 'left') {
          const xGap = this.node.style.left - gridLine
          this.node.style.left = gridLine
          this.node.style.width += xGap
        } else if (type === 'top' && vside === 'bottom') {
          this.node.style.height = gridLine - this.node.style.top
        } else if (type === 'top' && vside === 'top') {
          const yGap = this.node.style.top - gridLine
          this.node.style.top = gridLine
          this.node.style.height += yGap
        }
      }, hside, vside)

      this.updateCurNodePos()
    },
    onResizeEnd () {
      this.$store.commit('UPDATE_NODE', this.node)
      this.node.posEnd.x = this.node.style.left
      this.node.posEnd.y = this.node.style.top
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
    },
    onDbClick (e) {
      console.log(e)
    }
  }
}
</script>
