import { mount, rebind } from "../utils/common"
import { FishLink } from "./fishlink"
import { FishNode } from "./fishnode"
import { Graph } from "./graph"

export class DirectedLink {

    link: FishLink
    rev: boolean

    constructor(link: FishLink, rev: boolean) {
        this.link = link
        this.rev = rev
    }

    get key() { return this.link.key + "|" + this.rev.toString() }
    get original() { return this.link.original }
    get nodes() { return this.link.nodes }

    get sid() { return this.rev ? this.link.tid : this.link.sid }
    get tid() { return this.rev ? this.link.sid : this.link.tid }
    get ends() { return [this.sid, this.tid] }

    get text() { return this.sid + " - " + this.tid }
    get longtext() { return this.sid + ` (${this.original.type}/${this.original.weight}) ` + this.tid }
    get longtext1() { return this.sid + ` (${this.original.type}/${this.original.weight}) ` }
}

export class Path {

    links: DirectedLink[]

    constructor(chain: DirectedLink[]) {
        this.links = chain
    }

    get key() {
        return this.links.map(fl => fl.key).join("|")
    }

    get length() {
        return this.links.length
    }

    get properties() {
        return {
            "prop-header": "mark",
            chain: `${this.links.length}:\n` + this.links.map(l => `${l.original.type}`).join("\n")
        }
    }

    get source() { return this.links[0].sid }
    get target() { return this.links.last.tid }
    get ends() { return [this.source, this.target] }

    get text() { return this.source + " - " + this.target + ` (${this.links.length})` }
    get longtext() { return this.length.toString() + " " + this.links.flatMap(l => l.longtext1).join(" ") + " " + this.target }
}

export class PathMatrixBuilder {

    g: Graph
    dlinkmap: Map<string, DirectedLink[]>

    constructor(g: Graph) {

        this.g = g
        rebind(this)

        this.dlinkmap = new Map(
            g.links
                .flatMap(l => [new DirectedLink(l, false), new DirectedLink(l, true)])
                .groupBy(l => l.sid)
                .entries)
    }

    getlinks(nid: string) { return this.dlinkmap.get(nid) ?? [] }

    bfs(n: FishNode, linkchain: DirectedLink[], visited: Set<string>) {

        //console.log("bfs", n.id)

        if (linkchain.length > 2) return // termination criteria
        if (visited.has(n.id)) return
        visited.add(n.id)

        //console.log("bfs process", n.id)

        let links = this.getlinks(n.id)

        // flood next neighbors
        let fronteer: any[] = []
        for (let l of links) {

            if (visited.has(l.tid)) continue

            let n = this.g.nodemap.get(l.tid)
            if (!n) throw "nüll!"
            let chain = [...linkchain, l]
            n.addpath(new Path(chain))
            fronteer.push([n, chain])
        }

        //console.log("fronteer", fronteer)

        for (let [n, chain] of fronteer) {
            this.bfs(n, chain, visited)
        }
    }

    flood(investigatee: FishNode) {
        //console.log("flood", investigatee.id)
        this.bfs(investigatee, [], new Set<string>())
    }

    // flood(mar)
    initscores(investigatees: FishNode[]) {
        //console.log("initscores - call this once only!!")
        investigatees.forEach(this.flood)

        return this.g.nodes
            .filter(n => n.includeinmatrix)
            .sortBy(n => -n.numberOfPathsBetterEqual2)
        //.sortBy(n => n.paths.filter(p => p.length <= 2).map(p => p.source).distinctBy().length)
    }
}

mount({ PathMatrixBuilder })