export default function throttle (fn, delay = 50, timeout = 100) {
  let timer = null
  let tStart
  return function (...args) {
    const context = this
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
