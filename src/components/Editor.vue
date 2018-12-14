<template>
  <div class="editor">
    <div class="editor-main">
      <Grid />
      <ElementHandler
        v-for="(node, index) in nodes"
        :key="index"
        :node="node" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ElementHandler from './ElementHandler'
import Grid from '@/components/Grid'

export default {
  computed: {
    ...mapState({
      nodes: state => state.pages[state.currentPage] && state.pages[state.currentPage].nodes
    })
  },
  components: {
    ElementHandler,
    Grid
  }
}
</script>

<style lang="less">
.editor {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  &-main {
    position: relative;
    width: 960px;
    height: 700px;
    // background: pink;
  }
}
</style>
