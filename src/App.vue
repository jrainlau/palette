<template>
  <div id="app">
    <Comps/>
    <Editor/>
  </div>
</template>

<script>
import Comps from '@/components/Comps'
import Editor from '@/components/Editor'

export default {
  name: 'app',
  components: {
    Comps,
    Editor
  }
}
</script>

<style lang="less">
#app {
  height: 100%;
  width: 100%;
  display: flex;
}
</style>
