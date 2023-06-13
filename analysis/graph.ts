import { m } from "../app/model"
import { mc1 } from "../data/data.min"
import { mount, rebind } from "../utils/common"

export class FishNode {

    original: MC1Node
    nid
    _x
    _vx

    constructor(original) {
        this.original = original
        this.nid = cleanid(original.id)
        this.marks = []
    }

    get id() { return this.nid }
    get id10() { return this.nid.truncate(10) }
    get type() { return this.original.type }

    toString() { return `FN(${this.nid})` }

    set x(v) {
        if (Number.isNaN(v)) debugger
        this._x = v
    }
    get x() { return this._x }

    set vx(v) {
        if (Number.isNaN(v)) debugger
        this._vx = v
    }
    get vx() { return this._vx }

    // analysis
    marks: Mark[]

    addmark(mark: Mark) {
        //console.log("addmark", mark.key)
        if (this.marks.find(m => m.key == mark.key)) return
        //console.log("ok")
        this.marks.push(mark)
    }

    clearmarks() {
        this.marks = []
    }

    get score() {
        let sum = this.marks?.sum(m => 1 / m.length) ?? 0
        return sum
    }

    get properties() {
        return {
            "prop-header": "node",
            ...this.original,
            score: this.score.toFixed(2)
        }
    }
}

export class FishLink {

    original: MC1Link
    sid: string
    tid: string
    source: string | any // nid, reassigned by d3
    target: string | any // nid, reassigned by d3

    constructor(original) {
        this.original = original
        this.sid = this.source = cleanid(original.source)
        this.tid = this.target = cleanid(original.target)
    }

    get key() { return this.sid + "|" + this.tid }

    get type() { return this.original.type }
    get weight() { return this.original.weight }
    get nodes() { return [this.sid, this.tid] }

    toString() {
        return `${this.sid} -> ${this.tid}`
    }
}

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
}

export class Mark {

    chain: DirectedLink[]

    constructor(chain: DirectedLink[]) {
        this.chain = chain
    }

    get key() {
        return this.chain.map(fl => fl.key).join("|")
    }

    get length() {
        return this.chain.length
    }

    get properties() {
        return {
            "prop-header": "mark",
            //origin: this.origin.id,
            //distance: this.distance,
            //link: this.link?.type,
            //chain: `${this.chain.length}:\n` + this.chain.map(l => `${l.original.source} - ${l.original.type} - ${l.original.target}`).join("\n\n")
            chain: `${this.chain.length}:\n` + this.chain.map(l => `${l.original.type}`).join("\n")
        }
    }
}

export class Graph {

    nodes: any[]
    links: any[]

    constructor(nodes?: FishNode[], links?: FishLink[]) {
        this.nodes = nodes ?? []
        this.links = links ?? []
        rebind(this)
    }

    hasnode(n: FishNode | string): boolean {
        if ((n as any).trim) return this.nodes.find(n => n.id === n)
        return this.nodes.includes(n)
    }

    appendnode(n: FishNode) {
        if (!this.hasnode(n)) this.nodes.push(n)
    }

    appendnodes(ns: FishNode[]) {
        ns.forEach(this.appendnode)
    }

    haslink(e: FishLink): boolean {
        return this.links.includes(e)
    }

    appendlink(l: FishLink) {
        if (!this.haslink(l)) this.links.push(l)
    }

    appendlinks(ls: FishLink[]) {
        ls.forEach(this.appendlink)
    }
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