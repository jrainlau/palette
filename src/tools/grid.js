import getRectInfo from './getRectInfo'
import { approch } from './math'

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

export function highlight (context, stepx, stepy, x1, y1, x2, y2, x3, y3, rotate) {
  resetGrid(context, stepx, stepy)

  for (let i = stepx; i < context.canvas.width; i += stepx) {
    if ((!rotate && (x1 === i || x2 === i)) || x3 === i) {
      context.strokeStyle = 'blue'
      context.lineWidth = 1
      drawVerticalLine(context, i)
    }
  }

  for (let i = stepy; i < context.canvas.height; i += stepy) {
    if ((!rotate && (y1 === i || y2 === i)) || y3 === i) {
      context.strokeStyle = 'blue'
      context.lineWidth = 1
      drawHorizontalLine(context, i)
    }
  }
}

export function megnet (elInfo, gap, cb, hside = 'all', vside = 'all') {
  const { width, height } = elInfo.style
  const { centre, elTop, elRight, elBottom, elLeft, rotate } = getRectInfo(elInfo.style)
  const result = {
    type: '',
    value: null,
    gridLine: null
  }

  for (let i = 0, len = xCoordinates.length; i < len; i++) {
    const _x = xCoordinates[i]
    result.type = 'left'
    if ((hside === 'all' || hside === 'left') && approch(elLeft, _x, gap) && !rotate) {
      result.value = _x
      result.gridLine = _x
      cb(result)
    } else if ((hside === 'all' || hside === 'right') && approch(elRight, _x, gap) && !rotate) {
      result.value = _x - width
      result.gridLine = _x
      cb(result)
    } else if (hside === 'all' && approch(centre.x, _x, gap)) {
      result.value = _x - width / 2
      result.gridLine = _x
      cb(result)
    }
  }

  for (let i = 0, len = yCoordinates.length; i < len; i++) {
    const _y = yCoordinates[i]
    result.type = 'top'
    if ((vside === 'all' || vside === 'top') && approch(elTop, _y, gap) && !rotate) {
      result.value = _y
      result.gridLine = _y
      cb(result)
    } else if ((vside === 'all' || vside === 'bottom') && approch(elBottom, _y, gap) && !rotate) {
      result.value = _y - height
      result.gridLine = _y
      cb(result)
    } else if (vside === 'all' && approch(centre.y, _y, gap)) {
      result.value = _y - height / 2
      result.gridLine = _y
      cb(result)
    }
  }
}

export function drawRect (context, stepx, stepy, x, y, width, height) {
  resetGrid(context, stepx, stepy)
  context.beginPath()
  context.lineWidth = '1'
  context.strokeStyle = 'yellow'
  context.rect(x, y, width, height)
  context.stroke()
}
