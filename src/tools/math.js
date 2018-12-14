export function approch (oriNum, targetNum, gap = 5) {
  return Math.abs(targetNum - oriNum) <= gap
}

export function cartesian2polar (x, y) {
  let angleRate = 360 * Math.atan(y / x) / (2 * Math.PI) |> parseInt |> Math.abs
  if (y >= 0 && x < 0) {
    angleRate = 180 - angleRate
  } else if (y < 0 && x <= 0) {
    angleRate += 180
  } else if (y < 0 && x > 0) {
    angleRate = 360 - angleRate
  }
  return angleRate
}
