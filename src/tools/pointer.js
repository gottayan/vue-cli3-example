/* eslint-disable */
const dummy = () => {}

let G

(function () {
  G = this
})()  // 取得global或window，兼容Node与浏览器环境

function softBind (func, context) {
  return function (...args) {
    if (this === G) {
      func.call(context, ...args)
    } else {
      console.log(context);
      func.call(this, ...args)
    }
  }
}

function pointer (root, path = []) {
  return new Proxy(dummy, {
    get (target, property) {
      return pointer(root, path.concat(property))
    },
    apply (target, self, args) {
      let val = root
      let parent
      for (let i = 0; i < path.length; i++) {
        if (val === null || val === undefined) {
          break
        }
        parent = val
        val = val[path[i]]
      }
      if (typeof val === 'function') {
        val = softBind(val, parent)
      }
      if (val === null || val === undefined) {
        val = args[0]
      }
      return val
    }
  })
}

export default pointer