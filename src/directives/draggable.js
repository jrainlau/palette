import Vue from 'vue'

let draggable = false

const position = {
  begin: {
    x: 0,
    y: 0
  },
  end: {
    x: 0,
    y: 0
  }
}

let targetDom = null

Vue.directive('draggable', {
  inserted (el) {
    el.addEventListener('mousedown', (e) => {
      targetDom = e.target
      draggable = true
      position.begin.x = e.x
      position.begin.y = e.y
    })
    document.addEventListener('mousemove', (e) => {
      if (draggable) {
        const deltaX = e.x - position.begin.x
        const deltaY = e.y - position.begin.y
        targetDom.style.top = position.end.y + deltaY + 'px'
        targetDom.style.left = position.end.x + deltaX + 'px'
      }
    })
    document.addEventListener('mouseup', () => {
      draggable = false
      position.end.x = Number(targetDom.style.left.replace('px', ''))
      position.end.y = Number(targetDom.style.top.replace('px', ''))
    })
  }
})
