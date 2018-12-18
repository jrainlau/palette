import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let nodeId = 0
let groupId = `group-${(Math.random() * 1000000).toFixed(0)}`

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
    ADD_NODE (_state, node) {
      node.pageIndex = _state.currentPage
      _state.pages[_state.currentPage].nodes.push(node)
    },
    UPDATE_NODE (_state, node) {
      _state.pages[_state.currentPage].nodes.forEach((_node, i) => {
        if (_node.nodeId === node.nodeId) {
          _state.pages[_state.currentPage].nodes[i] = node
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
    },
    SET_AS_A_GROUP (_state, dissolve = false) {
      _state.pages[_state.currentPage].nodes.map(node => {
        if (!dissolve && node.onFocus && !node.groupId) {
          node.groupId = groupId
        } else if (!dissolve && node.onFocus && node.groupId) {
          console.warn(`Node with nodeId "${node.nodeId}" was in a group`)
        }
      })
      groupId = `group-${(Math.random() * 1000000).toFixed(0)}`
    },
    SELECT_AS_GROUP (_state, { groupId, val }) {
      _state.pages[_state.currentPage].nodes.map(node => {
        if (node.groupId && node.groupId === groupId) {
          node.onFocus = val
          node.selectByRange = val
        }
      })
    }
  },
  actions: {
    addNode ({ commit }, node) {
      node.nodeId = `node-${nodeId}`
      node.onFocus = true
      node.groupId = undefined
      node.selectByRange = false
      node.posStart = {
        x: 0,
        y: 0
      }
      node.posEnd = {
        x: 0,
        y: 0
      }
      commit('ADD_NODE', node)
      nodeId++
    }
  }
})
