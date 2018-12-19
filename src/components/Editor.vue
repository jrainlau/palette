<template>
  <div class="editor">
    <div class="editor-main">
      <Grid />
      <GroupWrapper />
      <ElementHandler
        v-for="(node, index) in nodes"
        :key="index"
        :node="node">
        <div v-if="node.type === 'text'">text</div>
        <div v-if="node.type === 'image'">image</div>
        <div v-if="node.type === 'video'">video</div>
        <div v-if="node.type === 'shape'">shape</div>
      </ElementHandler>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ElementHandler from './ElementHandler'
import Grid from '@/components/Grid'
import GroupWrapper from '@/components/GroupWrapper'

export default {
  computed: {
    ...mapState({
      nodes: state => state.pages[state.currentPage] && state.pages[state.currentPage].nodes
    })
  },
  mounted () {
    document.addEventListener('keyup', (e) => {
      if (e.keyCode === 91) {
        this.$store.commit('SET_AS_A_GROUP')
      }
    })
  },
  components: {
    ElementHandler,
    Grid,
    GroupWrapper
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
