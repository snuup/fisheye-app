import { mount, rebind } from "../utils/common"
import { FishLink, DirectedLink } from "./fishlink"
import { FishNode } from "./fishnode"
import { Path } from "./path"

export class Graph implements IGraph {

    nodes: FishNode[]
    links: FishLink[]
    enriched = false

    nodemap: Map<string, FishNode>
    linkmap: Map<string, DirectedLink[]>

    constructor(nodes: FishNode[], links: FishLink[]) {
        rebind(this)
        this.nodes = nodes
        this.links = links
        this.nodemap = new Map(this.nodes.map(n => [n.id, n]))
        let lm  = new Map()
        for (let l of links) {
            lm.getorcreate(l.source, () => []).push(new DirectedLink(l, false))
            lm.getorcreate(l.target, () => []).push(new DirectedLink(l, true))
        }
        this.linkmap = new Map()
    }

    static Empty = new Graph([], [])

    getnode(nid): FishNode { return this.nodemap.get(nid)! }

    addnode(n: FishNode) {
        this.nodes.push(n)
        this.nodemap.set(n.id, n)
    }

    removenode(n: FishNode) {
        this.nodes.remove(n)
        this.nodemap.delete(n.id)
    }

    hasnode(n: FishNode): boolean {
        return this.nodemap.has(n.id)
    }

    togglenode(n: FishNode) {
        if (this.hasnode(n)) {
            this.removenode(n)
            //n.selected = false
        }
        else {
            this.addnode(n)
            //n.selected = true
        }
    }

    searchnode(nidstart: string): FishNode | undefined {
        nidstart = nidstart.toLowerCase()
        return this.nodes.find(n => n.id.toLowerCase().startsWith(nidstart))
    }

    haslink(e: FishLink): boolean { return this.links.includes(e) }
    appendlink(l: FishLink) { if (!this.haslink(l)) this.links.push(l) }
    appendlinks(ls: FishLink[]) { ls.forEach(this.appendlink) }
    getoutlinks(nid: string) {
        console.log("getoutlinks")
        return this.links.filter(l => l.source == nid)
    }
    getinlinks(nid: string) { return this.links.filter(l => l.target == nid) }

    get nodecountsByType() { return this.nodes.countBy(n => n.type ?? "") }
    get linkcountsByType() { return this.links.countBy(n => n.type) }

    gettopdegrees(count = 25) {
        return this.nodes.sortBy(n => -n.degree).slice(0, count)
    }

    setnodedegrees() {
        this.nodes.forEach(n => {
            n.outdegree = this.getoutlinks(n.id).length
            n.indegree = this.getinlinks(n.id).length
        })
    }

    // get groupUps() {
    //     return this.nodes.groupBy(n => n.upfixed2)
    // }

    getneighborlinks(nid: string): DirectedLink[] {
        return this.linkmap[nid] // maybe add ?? [] // .map(dl => dl.target) // can be null, right ??
    }

    findpathsmulti(start: string, targets: string[]) {

        console.log("findpathsmulti", start, targets)

        let stargets = new Set(targets)

        let visited = new Set<string>()
        let goalpaths: Path[] = []

        const bfs = (fronteer: Path[]) => {

            let nextfronteer: Path[] = []
            let reachedtargets: string[] = [] // compute shortest paths only, so remove nodes found at this level from stargets below

            for (let p of fronteer) {
                let n = p.end
                visited.add(n)

                if (stargets.has(n)) {
                    goalpaths.push(p)
                    reachedtargets.push(n)
                }

                this.getneighborlinks(n)
                    .filter(l => !visited.has(l.target))
                    .map(l => p.with(l))
                    .forEach(p => nextfronteer.push(p))
            }

            reachedtargets.forEach(n => stargets.delete(n))

            let godeeper = fronteer.first.length < 3
            return (godeeper && stargets.size) ? nextfronteer : []
        }

        let fronteer: Path[] = this.getneighborlinks(start).map(l => new Path([l]))
        while (fronteer.length) {
            fronteer = bfs(fronteer)
        }

        console.log("visited", visited.size, "nodes", "found paths", goalpaths)

        return { goalpaths, visited }
    }
}

export class GraphView {
    nodes: FishNode[] = []
    links: FishLink[] = []

    constructor(rootgraph: Graph) { }
    static Empty = new GraphView(Graph.Empty)

    addnode(n: FishNode) { this.nodes.push(n) }
    removenode(n: FishNode) { this.nodes.remove(n) }
    hasnode(n: FishNode): boolean { return this.nodes.includes(n) }
    togglenode(n: FishNode) {
        if (this.hasnode(n)) {
            this.removenode(n)
            //n.selected = false
        }
        else {
            this.addnode(n)
            //n.selected = true
        }
    }
}

function printpath(p: FishNode[]) {
    return p.map(n => n.id).join(" - ")
}

mount({ printpath })

export class NodePath {

    constructor(public nodes: FishNode[]) { }
    static Empty = new NodePath([])

    //get links() { return d3.pairs(this.nodes).map(([n1, n2]) => n1.getneighborlink(n2)) }

    add(n) { this.nodes.push(n) }
    with(n: FishNode): NodePath { return new NodePath([...this.nodes, n]) }
    get first() { return this.nodes.first }
    get last() { return this.nodes.last }
    get length() { return this.nodes.length - 1 }
    get asText() { return this.nodes.map(n => n.id).join(" > ") }
}
