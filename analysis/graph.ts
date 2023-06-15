import { m } from "../app/model"
import { mc1 } from "../data/data"
import { mount, rebind } from "../utils/common"
import { FishLink } from "./fishlink"
import { FishNode } from "./fishnode"
import { DirectedLink, Mark } from "./mark"


export class Graph {

    nodes: FishNode[]
    links: FishLink[]

    // enriched
    nodemap_: Map<string, FishNode>
    get nodemap() { return this.nodemap_ ?? (this.nodemap_ = new Map(this.nodes.map(n => [n.nid, n]))) }

    constructor(nodes?: FishNode[], links?: FishLink[]) {
        this.nodes = nodes ?? []
        this.links = links ?? []
        rebind(this)
        this.enrichnodes()
    }

    getnode(nid) : FishNode {
        return this.nodemap.get(nid)!
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

    gettopdegrees(inludeInvestigatees = true) {
        let tops = m.graph.nodes.sortBy(n => -n.degree).slice(0, 25)
        let names = tops.map(n => n.nid)

        let missings = m.investigatees.filter(inv => !names.includes(inv)).map(this.getnode)
        if(inludeInvestigatees){
            tops.push(...missings)
            tops.sortBy(n => -n.degree)
        }

        return tops
    }

    enrichnodes() {

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

export interface Degree {
    nid: string
    count: number
    links: FishLink[]
}

const cleanid = (id) => typeof id === "number" ? "#" + id : id

let all = {
    nodes: mc1.nodes.map(o => new FishNode(o)) as FishNode[],
    links: mc1.links.map(o => new FishLink(o)) as FishLink[]
}

export const nodemap = new Map(all.nodes.map(n => [n.nid, n]))

export function getsubgraph(nid: string): Graph {
    console.log("getsubgraph", nid)
    let links = all.links.filter((l) => l.sid === nid || l.tid == nid)
    return getgraph(links)
}

export function getsuspectgraph(n: FishNode) {
    console.log("getsuspectgraph", n)
    let links = n.marks.flatMap(m => m.chain.map(dl => dl.link)).distinctBy(l => l.key)
    return getgraph(links)
}

export function addlinks(ns: FishNode[]) {
    let nids = ns.map(n => n.id)
    let adds = all.links.filter(l => nids.includes(l.sid) && nids.includes(l.tid))
    m.graph.appendlinks(adds)
}

function getgraph(links: FishLink[]) {
    let nodes = [...new Set(links.flatMap(l => [nodemap.get(l.sid), nodemap.get(l.tid)]))] as FishNode[]
    return new Graph(nodes, links)
}

// analysis
const dlinkmap =
    all.links
        .flatMap(l => [new DirectedLink(l, false), new DirectedLink(l, true)])
        .groupBy(l => l.sid)


//let inv = nodemap.get(m.investigatees[2])
let mar = nodemap.get("Mar de la Vida OJSC")

function bfs(n: FishNode, linkchain: DirectedLink[], visited: Set<string>) {

    //console.log("bfs", n.id)

    if (linkchain.length > 1) return // termination criteria
    if (visited.has(n.id)) return
    visited.add(n.id)

    //console.log("bfs process", n.id)

    let links: DirectedLink[] = dlinkmap[n.id] ?? []

    // flood next neighbors
    let fronteer: any[] = []
    for (let l of links) {

        if (visited.has(l.tid)) continue

        let n = nodemap.get(l.tid)
        if (!n) throw "nüll!"
        let chain = [...linkchain, l]
        n.addmark(new Mark(chain))
        fronteer.push([n, chain])
    }

    //console.log("fronteer", fronteer)

    for (let [n, chain] of fronteer) {
        bfs(n, chain, visited)
    }
}

export function flood(investigatee: FishNode) {
    console.log("flood", investigatee.id)
    bfs(investigatee, [], new Set<string>())
}

// flood(mar)
export function initscores() {
    m.investigatees.map(id => nodemap.get(id)).forEach(flood)
    window.tops = all.nodes.sortBy(n => -n.score).slice(0, 20)
}

mount({ nodemap, dlinkmap, all, flood, mar })