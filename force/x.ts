import { mount } from "../utils/common.js"
import constant from "./constant.js"

export default function (x) {
  var strength = constant(0.1),
    nodes,
    strengths,
    xz

  console.log("create force")


  if (typeof x !== "function") x = constant(x == null ? 0 : +x)

  function force(alpha) {
    console.log("xz", alpha, xz.join())
    mount({ xzforce: xz })
    for (var i = 0, n = nodes.length, node; i < n; ++i) {
      node = nodes[i], node.vx += (xz[i] - node.x) * strengths[i] * alpha
    }
    if (xz.last == 316) debugger
    console.log("xz", xz.join())
  }

  function initialize() {
    if (!nodes) return
    var i, n = nodes.length
    strengths = new Array(n)
    xz = new Array(n)
    for (i = 0; i < n; ++i) {
      strengths[i] = isNaN(xz[i] = +x(nodes[i], i, nodes)) ? 0 : +strength(nodes[i], i, nodes)
    }
    console.log("xz0", xz.join())
    mount({ xz0: xz })
  }

  force.initialize = function (_) {
    nodes = _
    initialize()
  }

  force.strength = function (_) {
    return arguments.length ? (strength = typeof _ === "function" ? _ : constant(+_), initialize(), force) : strength
  }

  force.x = function (_) {
    return arguments.length ? (x = typeof _ === "function" ? _ : constant(+_), initialize(), force) : x
  }

  return force
}
