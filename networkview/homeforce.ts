import { FishNodeForce } from "../elements/fishnode"

export function homeforce() {

    let strength = 0.1, nodes: FishNodeForce[]

    function force(alpha) {
        nodes.forEach((n) => {
            n.vx += (n.xgreed - n.x) * strength * alpha
            n.vy += (n.ygreed - n.y) * strength * alpha
            if (isNaN(n.vx)) debugger
        })
    }

    force.initialize = function (_) {
        nodes = _
        console.log("home force intialized", _)
    }

    force.strength = function (_) {
        return arguments.length ? (strength = _, force) : strength
    }

    return force
}
