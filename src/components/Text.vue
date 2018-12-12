<template>
  <div
    :ref="refId"
    :class="`comp-text comp-instance ${editMode ? 'edit-mode' : ''}`"
    :style="styleObj"
    @mousedown="dragStart">
    {{info.content}}
  </div>
</template>

<script>
import getRectInfo from '@/tools/getRectInfo'
import { megnet } from '@/tools/grid'
import throttle from '@/tools/throttle'

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
      editMode: true,
      posStart: {
        x: 0,
        y: 0
      },
      posEnd: {
        x: 0,
        y: 0
      },
      info: this.node,
      refId: (Math.random() * 1000000).toFixed(0)
    }
  },
  computed: {
    styleObj () {
      return `
        width: ${this.info.width}px;
        height: ${this.info.height}px;
        top: ${this.info.y}px;
        left: ${this.info.x}px;
      `
    }
  },
  mounted () {
    document.addEventListener('mousedown', (e) => {
      if (e.target !== this.$refs[this.refId]) {
        this.editMode = false
      }
    })
  },
  methods: {
    setNodePos () {
      const { width, height, x, y } = this.info
      const nodePos = getRectInfo({ width, height, top: y, left: x })
      throttle(() => {
        this.$store.dispatch('setNodePos', nodePos)
      }, 100, 200)()
    },
    dragStart (e) {
      this.setNodePos()

      document.addEventListener('mousemove', this.onDrag)
      document.addEventListener('mouseup', this.dragEnd)
      this.draggable = true
      this.hasDragged = false
      this.editMode = true
      this.posStart.x = e.x
      this.posStart.y = e.y
      this.$store.commit('SET_ON_DRAG', true)
    },
    onDrag (e) {
      e.stopPropagation()
      if (this.draggable) {
        const deltaX = e.x - this.posStart.x
        const deltaY = e.y - this.posStart.y
        this.info.y = this.posEnd.y + deltaY
        this.info.x = this.posEnd.x + deltaX
        this.hasDragged = true

        megnet(this.info, 5, ({ type, value }) => {
          this.info[type] = value
        })

        this.setNodePos()
      }
    },
    dragEnd (e) {
      e.stopPropagation()
      this.draggable = false
      this.posEnd.x = this.info.x
      this.posEnd.y = this.info.y
      if (this.hasDragged) {
        this.$store.dispatch('updateNode', this.info)
      }
      this.$store.commit('SET_ON_DRAG', false)
      document.removeEventListener('mousemove', this.onDrag)
      document.removeEventListener('mouseup', this.dragEnd)
    }
  }
}
</script>

<style lang="less">
.comp-text {
  text-align: center;
}
</style>
