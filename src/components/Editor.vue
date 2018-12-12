<template>
  <div class="editor">
    <div class="editor-main">
      <Grid />
      <PText
        v-for="(node, index) in nodes"
        :key="index"
        :node="node" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import PText from './Text'
import Grid from '@/components/Grid'

export default {
  computed: {
    ...mapState({
      nodes: state => state.pages[state.currentPage] && state.pages[state.currentPage].nodes
    })
  },
  components: {
    PText,
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
