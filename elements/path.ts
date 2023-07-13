import { mount, rebind } from "../utils/common"
import { FishLink, DirectedLink } from "./fishlink"
import { FishNode } from "./fishnode"
import { Graph } from "./graph"

export class Path<L extends ILink> {

    links: DirectedLink<L>[]

    constructor(chain: DirectedLink<L>[]) {
        this.links = chain
    }

    // get key() {
    //     return this.links.map(fl => fl.key).join("|")
    // }

    get length() {
        return this.links.length
    }

    // get properties() {
    //     return {
    //         "prop-header": "mark",
    //         chain: `${this.links.length}:\n` + this.links.map(l => `${l.original.type}`).join("\n")
    //     }
    // }

    get start() { return this.links[0].source }
    get end() { return this.links.last.target }
    get ends() { return [this.start, this.end] }
    get allnodes() { return [this.start, ...this.links.map(l => l.target)] }

    get text() { return this.start + " - " + this.end + ` (${this.links.length})` }
    get longtext() { return this.length.toString() + " " + this.links.flatMap(l => l.text).join(" ") + " " + this.end }
    get asText() { return this.longtext }

    with(l: DirectedLink<L>): Path<L> { return new Path([...this.links, l]) }
}

export class PathMatrixBuilder {

    // g: Graph
    // dlinkmap: Map<string, DirectedLink[]>

    // constructor(g: Graph) {

    //     this.g = g
    //     rebind(this)

    //     this.dlinkmap = new Map(
    //         g.links
    //             .flatMap(l => [new DirectedLink(l, false), new DirectedLink(l, true)])
    //             .groupBy(l => l.source)
    //             .entries)
    // }

    // getlinks(nid: string) { return this.dlinkmap.get(nid) ?? [] }

    // bfs(n: FishNode, linkchain: DirectedLink[], visited: Set<string>) {

    //     //console.log("bfs", n.id)

    //     if (linkchain.length > 2) return // termination criteria
    //     if (visited.has(n.id)) return
    //     visited.add(n.id)

    //     //console.log("bfs process", n.id)

    //     let links = this.getlinks(n.id)

    //     // flood next neighbors
    //     let fronteer: any[] = []
    //     for (let l of links) {

    //         if (visited.has(l.target)) continue

    //         let n = this.g.nodemap.get(l.target)
    //         if (!n) throw "nüll!"
    //         let chain = [...linkchain, l]
    //         n.addpath(new Path(chain))
    //         fronteer.push([n, chain])
    //     }

    //     //console.log("fronteer", fronteer)

    //     for (let [n, chain] of fronteer) {
    //         this.bfs(n, chain, visited)
    //     }
    // }

    // flood(investigatee: FishNode) {
    //     //console.log("flood", investigatee.id)
    //     this.bfs(investigatee, [], new Set<string>())
    // }

    // // flood(mar)
    // initscores(investigatees: FishNode[]) {
    //     //console.log("initscores - call this once only!!")
    //     investigatees.forEach(this.flood)

    //     return this.g.nodes
    //         .filter(n => n.includeinmatrix)
    //         .sortBy(n => -n.numberOfPathsBetterEqual2)
    //     //.sortBy(n => n.paths.filter(p => p.length <= 2).map(p => p.source).distinctBy().length)
    // }
}

mount({ PathMatrixBuilder })