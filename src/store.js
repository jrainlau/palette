import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let nodeId = 0

export default new Vuex.Store({
  state: {
    currentPage: 0,
    pages: [{
      pageId: 0,
      groups: [],
      nodes: [],
      background: []
    }],
    nodePos: {}
  },
  mutations: {
    ADD_NODE (_state, { pageIndex, node }) {
      _state.pages[pageIndex].nodes.push(node)
    },
    UPDATE_NODE (_state, { pageIndex, node }) {
      _state.pages[pageIndex].nodes.forEach((_node, i) => {
        if (_node.nodeId === node.nodeId) {
          _state.pages[pageIndex].nodes[i] = node
        }
      })
    },
    SET_NODE_POS (_state, pos) {
      _state.nodePos = pos
    }
  },
  actions: {
    addNode ({ commit }, { pageIndex, node }) {
      node.nodeId = nodeId
      node.pageIndex = pageIndex
      commit('ADD_NODE', { pageIndex, node })
      nodeId++
    },
    updateNode ({ commit }, node) {
      const { pageIndex } = node
      commit('UPDATE_NODE', { pageIndex, node })
    },
    setNodePos ({ commit }, pos) {
      commit('SET_NODE_POS', pos)
    }
  }
})
