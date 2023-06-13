import { mc1 } from "../data/data.min"
import { Graph } from "./graph"

export function computestats(g: Graph) {
    return {
        nodecount: g.nodes.length,
        linkcount: g.links.length
    }
}