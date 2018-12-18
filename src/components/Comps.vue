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
let zIndex = 0

export default {
  data () {
    return {
      compList: ['text', 'image', 'video', 'shape'],
      basicStyle: `{
        "width": 150,
        "height": 30,
        "lineHeight": 30,
        "left": 0,
        "top": 0,
        "zIndex": "${zIndex}",
        "border": "none",
        "rotate": 0,
        "color": "#333",
        "textAlign": "center"
      }`
    }
  },
  methods: {
    addNode (type) {
      zIndex++
      if (type === 'text') {
        this.$store.dispatch('addNode', {
          type,
          content: 'Text',
          style: JSON.parse(this.basicStyle)
        })
      }
      if (type === 'image') {
        this.$store.dispatch('addNode', {
          type,
          content: 'Image',
          style: { ...JSON.parse(this.basicStyle), height: 150 }
        })
      }
      if (type === 'video') {
        this.$store.dispatch('addNode', {
          type,
          content: 'Video',
          style: { ...JSON.parse(this.basicStyle), width: 350, height: 250 }
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
