import { FishNode } from "../elements/fishnode"

export function homeforce() {
    var strength: 0.1,
        nodes: FishNode[],
        xz

    function force(alpha) {
        for (var i = 0, n = nodes.length, node; i < n; ++i) {
            node = nodes[i], node.vx += (xz[i] - node.home.x) * strength * alpha
            if (isNaN(node.home.x)) debugger
            if (isNaN(node.x)) debugger
            //console.log(nodes[i])
        }
    }

    function initialize() {
        if (!nodes) return
        xz = new Array(nodes.length)
    }

    force.initialize = function (_) {
        nodes = _
        console.log("home force intialized", _)
        initialize()
    }

    force.strength = function (_) {
        return arguments.length ? (strength = _, initialize(), force) : strength
    }

    return force
}
