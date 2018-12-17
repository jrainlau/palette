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
    nodePos: {},
    onDrag: false,
    selectArea: {}
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
    UPDATE_CUR_NODE_POS (_state, pos) {
      _state.nodePos = pos
    },
    SET_ON_DRAG (_state, value) {
      _state.onDrag = value
    },
    SET_NODE_POSEND (_state) {
      _state.pages[_state.currentPage].nodes.map(node => {
        node.posEnd.y = node.style.top
        node.posEnd.x = node.style.left
      })
    },
    SET_SELECT_AREA (_state, area) {
      _state.selectArea = area
    },
    UPDATE_NODE_POS (_state, { deltaX, deltaY }) {
      _state.pages[_state.currentPage].nodes.map(node => {
        if (node.onFocus) {
          node.style.top = node.posEnd.y + (deltaY || 0)
          node.style.left = node.posEnd.x + (deltaX || 0)
        }
      })
    }
  },
  actions: {
    addNode ({ commit }, { pageIndex, node }) {
      node.nodeId = nodeId
      node.pageIndex = pageIndex
      node.onFocus = true
      node.posStart = {
        x: 0,
        y: 0
      }
      node.posEnd = {
        x: 0,
        y: 0
      }
      commit('ADD_NODE', { pageIndex, node })
      nodeId++
    },
    updateNode ({ commit }, node) {
      const { pageIndex } = node
      commit('UPDATE_NODE', { pageIndex, node })
    },
    updateCurNodePos ({ commit }, pos) {
      commit('UPDATE_CUR_NODE_POS', pos)
    },
    setSelectArea ({ commit }, area) {
      commit('SET_SELECT_AREA', area)
    },
    updateNodePos ({ commit }, delta) {
      commit('UPDATE_NODE_POS', delta)
    }
  }
})
