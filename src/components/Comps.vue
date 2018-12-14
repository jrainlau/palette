<template>
  <div class="comps">
    <div
      v-for="(comp, i) in compList"
      :key="`comp-${i}`"
      :class="`comps-item comps-item_${comp}`"
      @click="addNode(comp)">
      {{comp}}
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      compList: ['text', 'image', 'video']
    }
  },
  methods: {
    addNode (type) {
      if (type === 'text') {
        this.$store.dispatch('addNode', {
          pageIndex: 0,
          node: {
            type,
            x: 0,
            y: 0,
            depth: 1,
            width: 150,
            height: 30,
            rotate: 0,
            content: 'Text'
          }
        })
      }
    }
  }
}
</script>

<style lang="less">
.comps {
  flex: none;
  width: 160px;
  height: 100%;
  padding: 0 15px;
  box-sizing: border-box;
  &-item {
    width: 130px;
    height: 130px;
    background: #333;
    margin-bottom: 15px;
    color: #fff;
  }
}
</style>
