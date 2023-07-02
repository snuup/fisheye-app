import { mount, rebind } from "../utils/common"
import { FishLink } from "./fishlink"
import { FishNode } from "./fishnode"
import { DirectedLink, Path } from "./path"


export class Graph {

    nodes: FishNode[]
    links: FishLink[]
    enriched = false

    // enriched
    nodemap_: Map<string, FishNode>
    get nodemap() { return this.nodemap_ ?? (this.nodemap_ = new Map(this.nodes.map(n => [n.nid, n]))) }

    constructor(nodes?: FishNode[], links?: FishLink[]) {
        this.nodes = nodes?.map(FishNode.clone) ?? []
        this.links = links?.map(FishLink.clone) ?? []
        rebind(this)
        this.enrichnodes()
    }

    static Empty = new Graph()

    getnode(nid): FishNode {
        return this.nodemap.get(nid)!
    }

    addnode(n: FishNode) {
        this.nodes.push(n)
        this.nodemap.set(n.id, n)
    }

    removenode(n: FishNode) {
        this.nodes.remove(n)
        this.nodemap.delete(n.id)
    }

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

    searchnode(nidstart: string): FishNode | undefined {
        nidstart = nidstart.toLowerCase()
        return this.nodes.find(n => n.id.toLowerCase().startsWith(nidstart))
    }

    // hasnode(n: FishNode | string): boolean {
    //     if (n instanceof String) return this.nodes.find(n => n.id === n)
    //     return this.nodes.includes(n)
    // }

    // appendnode(n: FishNode) {
    //     if (!this.hasnode(n)) this.nodes.push(n)
    // }

    // appendnodes(ns: FishNode[]) {
    //     ns.forEach(this.appendnode)
    // }

    haslink(e: FishLink): boolean {
        return this.links.includes(e)
    }

    hasnode(n: FishNode): boolean {
        return this.nodemap.has(n.id)
    }

    appendlink(l: FishLink) {
        if (!this.haslink(l)) this.links.push(l)
    }

    appendlinks(ls: FishLink[]) {
        ls.forEach(this.appendlink)
    }

    getlinks(n: string) {
        return this.links.filter(l => l.sid == n)
    }

    get nodecountsByType() { return this.nodes.countBy(n => n.type ?? "") }
    get linkcountsByType() { return this.links.countBy(n => n.type) }

    gettopdegrees(count = 25) {
        return this.nodes.sortBy(n => -n.degree).slice(0, count)
    }

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

    findpaths(start: FishNode, target: FishNode) {

        if (!this.enriched) throw "path must be enriched"

        let visited: FishNode[] = []
        let goalpaths: Path2[] = []

        function bfs(fronteer: Path2[]) {

            let nextfronteer: Path2[] = []

            for (let p of fronteer) {
                let n = p.last

                if (visited.includes(n)) continue
                visited.push(n)

                //let pp = [...p, n]
                if (n == target) goalpaths.push(p)

                nextfronteer.push(...n.allneighbors?.map(nn => [...p, nn]) ?? [])
                nextfronteer = nextfronteer.distinctBy()
            }

            return nextfronteer
        }

        let fronteer: Path2[] = [[start]]
        while (fronteer.length) {
            fronteer = bfs(fronteer)
        }

        console.log("visited", visited.length, "nodes")

        return { goalpaths, visited }
    }
}

type Path2 = FishNode[]