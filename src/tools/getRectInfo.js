export default function getRectInfo (elInfo) {
  let { top, left, width, height, rotate } = elInfo
  rotate = rotate % 180
  return {
    elLeft: left,
    elRight: left + width,
    elTop: top,
    elBottom: top + height,
    centre: {
      x: left + width / 2,
      y: top + height / 2
    },
    rotate
  }
}
