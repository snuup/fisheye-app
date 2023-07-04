import * as d3 from 'd3'
import { mount, rebind } from "../utils/common"
import { FishLink } from "./fishlink"
import { FishNode } from "./fishnode"
import { DirectedLink, Path } from "./path"
import { SuperLink } from './superlink'
import { NodePath } from './graph'

export class SuperGraph {

    nodes: FishNode[]
    links: SuperLink[]
    enriched = false

    // enriched
    nodemap_: Map<string, FishNode>
    get nodemap() { return this.nodemap_ ?? (this.nodemap_ = new Map(this.nodes.map(n => [n.nid, n]))) }

    constructor(nodes: FishNode[], links: FishLink[]) {
        this.nodes = nodes

        let linkgroups = links.groupBy(l => l.ukey)

        this.links = linkgroups.values.map(ls => new SuperLink(ls))
        
        rebind(this)
        this.enrichnodes()
    }

    static Empty = new SuperGraph([], [])

    getnode(nid): FishNode {
        return this.nodemap.get(nid)!
    }

    // addnode(n: FishNode) {
    //     this.nodes.push(n)
    //     this.nodemap.set(n.id, n)
    // }

    // removenode(n: FishNode) {
    //     this.nodes.remove(n)
    //     this.nodemap.delete(n.id)
    // }

    // hasnode(n: FishNode): boolean {
    //     return this.nodemap.has(n.id)
    // }

    // togglenode(n: FishNode) {
    //     if (this.hasnode(n)) {
    //         this.removenode(n)
    //         n.selected = false
    //     }
    //     else {
    //         this.addnode(n)
    //         n.selected = true
    //     }
    // }

    searchnode(nidstart: string): FishNode | undefined {
        nidstart = nidstart.toLowerCase()
        return this.nodes.find(n => n.id.toLowerCase().startsWith(nidstart))
    }

    // haslink(e: FishLink): boolean {
    //     return this.links.includes(e)
    // }

    // appendlink(l: FishLink) {
    //     if (!this.haslink(l)) this.links.push(l)
    // }

    // appendlinks(ls: FishLink[]) {
    //     ls.forEach(this.appendlink)
    // }

    // getlinks(n: string) {
    //     return this.links.filter(l => l.sid == n)
    // }

    // get nodecountsByType() { return this.nodes.countBy(n => n.type ?? "") }
    // get linkcountsByType() { return this.links.countBy(n => n.type) }

    // gettopdegrees(count = 25) {
    //     return this.nodes.sortBy(n => -n.degree).slice(0, count)
    // }

    enrichnodes() {

        //console.log("enrichnodes", this.nodes.length, this.links.length)

        this.links
            .groupBy(l => l.sid)
            .entries
            .forEach(([nid, links]) => this.getnode(nid).outlinks = links)

        this.links
            .groupBy(l => l.tid)
            .entries
            .forEach(([nid, links]) => this.getnode(nid).inlinks = links)

        this.links
            .forEach(l => {
                l.source = this.getnode(l.sid)
                l.target = this.getnode(l.tid)
            })

        this.enriched = true
    }

    get groupUps() {
        return this.nodes.groupBy(n => n.upfixed2)
    }


    findpathsmulti(start: FishNode, targets: FishNode[]) {

        console.log("findpathsmulti", start, targets)

        let stargets = new Set<FishNode>(targets)

        if (!this.enriched) throw "path must be enriched"

        let visited = new Set<string>()
        let goalpaths: NodePath[] = []

        function bfs(fronteer: Set<NodePath>) {

            let nextfronteer = new Set<NodePath>()
            let reachedtargets: FishNode[] = [] // compute shortest paths only, so remove nodes found at this level from stargets below

            for (let p of fronteer) {
                let n = p.last
                visited.add(n.id)

                if (stargets.has(n)) {
                    goalpaths.push(p)
                    reachedtargets.push(n)
                }

                n.allneighbors
                    ?.filter(n => !visited.has(n.id))
                    ?.map(n => p.with(n))
                    ?.forEach(p => nextfronteer.add(p))
            }

            reachedtargets.forEach(n => stargets.delete(n))

            let godeeper = fronteer.head.length < 3
            return (godeeper && stargets.size) ? nextfronteer : new Set<NodePath>()
        }

        let fronteer: Set<NodePath> = new Set(targets.length ? [new NodePath([start])] : [])
        while (fronteer.size) {
            fronteer = bfs(fronteer)
        }

        console.log("visited", visited.size, "nodes", "found paths", goalpaths)

        return { goalpaths, visited }
    }
}

export class SuperGraphView {
    nodes: FishNode[] = []
    links: SuperLink[] = []

    constructor(rootgraph: SuperGraph) { }
    static Empty = new SuperGraphView(SuperGraph.Empty)

    addnode(n: FishNode) { this.nodes.push(n) }
    removenode(n: FishNode) { this.nodes.remove(n) }
    hasnode(n: FishNode): boolean { return this.nodes.includes(n) }
    togglenode(n: FishNode) {
        if (this.hasnode(n)) {
            this.removenode(n)
            n.selected = false
        }
        else {
            this.addnode(n)
            n.selected = true
        }
    }
}
