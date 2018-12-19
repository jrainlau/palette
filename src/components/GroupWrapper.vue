<template>
  <div class="group-wrapper" :style="styleObj"></div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      nodes: state => state.pages[state.currentPage] && state.pages[state.currentPage].nodes
    }),
    grouppedNodes () {
      const nodesList = []
      this.nodes.forEach(node => {
        if (node.onFocus && node.groupId) {
          nodesList.push(node)
        }
      })
      return nodesList
    },
    styleObj () {
      const style = {}
      const getMost = (pos) => {
        return this.grouppedNodes.length && this.grouppedNodes.reduce((acc, cur) => {
          let accValue
          let curValue
          let compare = (pos === 'left' || pos === 'top') ? 'min' : 'max'

          if (typeof acc === 'number') {
            accValue = acc
          } else if (typeof acc === 'object' && (pos === 'left' || pos === 'top')) {
            accValue = acc.style[pos]
          } else if (typeof acc === 'object' && pos === 'right') {
            accValue = acc.style.left + acc.style.width
          } else if (typeof acc === 'object' && pos === 'bottom') {
            accValue = acc.style.top + acc.style.height
          }

          if (typeof cur === 'number') {
            curValue = cur
          } else if (typeof cur === 'object' && (pos === 'left' || pos === 'top')) {
            curValue = cur.style[pos]
          } else if (typeof cur === 'object' && pos === 'right') {
            curValue = cur.style.left + cur.style.width
          } else if (typeof cur === 'object' && pos === 'bottom') {
            curValue = cur.style.top + cur.style.height
          }

          return Math[compare].apply(null, [accValue, curValue])
        })
      }
      style.left = getMost('left') + 'px'
      style.top = getMost('top') + 'px'
      style.width = getMost('right') - getMost('left') + 'px'
      style.height = getMost('bottom') - getMost('top') + 'px'
      style.display = getMost('right') - getMost('left') ? 'block' : 'none'
      return style
    }
  }
}
</script>

<style lang="less">
.group-wrapper {
  border: 1px solid lightseagreen;
  position: absolute;
}
</style>
