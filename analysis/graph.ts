import { mount, rebind } from "../utils/common"
import { FishLink } from "./fishlink"
import { FishNode } from "./fishnode"
import { DirectedLink, Path } from "./path"


export class Graph {

    nodes: FishNode[]
    links: FishLink[]

    // enriched
    nodemap_: Map<string, FishNode>
    get nodemap() { return this.nodemap_ ?? (this.nodemap_ = new Map(this.nodes.map(n => [n.nid, n]))) }

    constructor(nodes?: FishNode[], links?: FishLink[]) {
        this.nodes = nodes?.map(o => o.fullclone()) ?? []
        this.links = links?.map(o => o.fullclone()) ?? []
        rebind(this)
        this.enrichnodes()
    }

    static Empty = new Graph()

    getnode(nid): FishNode {
        return this.nodemap.get(nid)!
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

        console.log("enrichnodes", this.nodes.length, this.links.length)

        this.links
            .groupBy(l => l.sid)
            .entries
            .forEach(([nid, links]) => this.getnode(nid).outlinks = links)

        this.links
            .groupBy(l => l.tid)
            .entries
            .forEach(([nid, links]) => this.getnode(nid).inlinks = links)
    }
}
