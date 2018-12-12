export default function getRectInfo (elInfo) {
  const { top, left, width, height } = elInfo
  return {
    elLeft: left,
    elRight: left + width,
    elTop: top,
    elBottom: top + height,
    centre: {
      x: left + width / 2,
      y: top + height / 2
    }
  }
}
