import getRectInfo from './getRectInfo'

export const xCoordinates = []
export const yCoordinates = []

let initCoordinates = false

function drawVerticalLine (context, i) {
  context.beginPath()
  context.moveTo(i, 0)
  context.lineTo(i, context.canvas.height)
  context.stroke()
}

function drawHorizontalLine (context, i) {
  context.beginPath()
  context.moveTo(0, i)
  context.lineTo(context.canvas.width, i)
  context.stroke()
}

export function drawGrid (context, stepx, stepy) {
  context.strokeStyle = 'lightgrey'
  context.lineWidth = 0.5

  for (let i = stepx + 0.5; i < context.canvas.width; i += stepx) {
    drawVerticalLine(context, i)
    initCoordinates ? void 0 : xCoordinates.push(i - 0.5)
  }
  for (let i = stepy + 0.5; i < context.canvas.height; i += stepy) {
    drawHorizontalLine(context, i)
    initCoordinates ? void 0 : yCoordinates.push(i - 0.5)
  }

  initCoordinates = true
}

export function resetGrid (context, stepx, stepy) {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height)
  drawGrid(context, stepx, stepy)
}

export function highlight (context, stepx, stepy, x1, y1, x2, y2, x3, y3) {
  resetGrid(context, stepx, stepy)

  for (let i = stepx; i < context.canvas.width; i += stepx) {
    if (x1 === i || x2 === i || x3 === i) {
      context.strokeStyle = 'blue'
      context.lineWidth = 1
      drawVerticalLine(context, i)
    }
  }

  for (let i = stepy; i < context.canvas.height; i += stepy) {
    if (y1 === i || y2 === i || y3 === i) {
      context.strokeStyle = 'blue'
      context.lineWidth = 1
      drawHorizontalLine(context, i)
    }
  }
}

export function megnet (elInfo, gap, cb) {
  const { width, height, x, y } = elInfo
  const { centre, elTop, elRight, elBottom, elLeft } = getRectInfo({ width, height, top: y, left: x })
  const result = {
    type: '',
    value: null
  }

  for (let i = 0, len = xCoordinates.length; i < len; i++) {
    const _x = xCoordinates[i]
    result.type = 'x'
    if (Math.abs(elLeft - _x) < gap) {
      result.value = _x
      cb(result)
    }
    if (Math.abs(elRight - _x) < gap) {
      result.value = _x - width
      cb(result)
    }
    if (Math.abs(centre.x - _x) < gap) {
      result.value = _x - width / 2
      cb(result)
    }
  }

  for (let i = 0, len = yCoordinates.length; i < len; i++) {
    const _y = yCoordinates[i]
    result.type = 'y'
    if (Math.abs(elTop - _y) < gap) {
      result.value = _y
      cb(result)
    }
    if (Math.abs(elBottom - _y) < gap) {
      result.value = _y - height
      cb(result)
    }
    if (Math.abs(centre.y - _y) < gap) {
      result.value = _y - height / 2
      cb(result)
    }
  }
}
