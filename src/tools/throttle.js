export default function throttle (fn, delay, timeout) {
  let timer = null
  let tStart
  return function () {
    const context = this
    const args = arguments
    const tCurr = +new Date()
    clearTimeout(timer)
    if (!tStart) {
      tStart = tCurr
    }
    if (tCurr - tStart >= timeout) {
      fn.apply(context, args)
      tStart = tCurr
    } else {
      timer = setTimeout(() => {
        fn.apply(context, args)
      }, delay)
    }
  }
}
