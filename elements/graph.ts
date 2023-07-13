import { mount, rebind } from "../utils/common"
import { DirectedLink, FishLink } from "./fishlink"
import { FishNode } from "./fishnode"
import { Path } from "./path"

export class Graph<LinkType extends ILink> implements IGraph<LinkType> {

    nodes: FishNode[]
    links: LinkType[]

    nodemap: Map<string, FishNode>
    linkmap: Map<string, DirectedLink<LinkType>[]>

    constructor(nodes: FishNode[], links: LinkType[]) {
        rebind(this)
        this.nodes = nodes
        this.links = links
        this.fixup()
    }

    fixup() {
        this.fixupnodemap()
        this.fixuplinkmap()
    }

    fixupnodemap() {
        this.nodemap = new Map(this.nodes.map(n => [n.id, n]))
    }

    fixuplinkmap() {
        let lm = new Map()
        for (let l of this.links) {
            lm.getorcreate(l.source, () => []).push(new DirectedLink(l, false))
            lm.getorcreate(l.target, () => []).push(new DirectedLink(l, true))
        }
        this.linkmap = lm
    }

    static Empty = new Graph([], [])

    getnode(nid): FishNode { return this.nodemap.get(nid)! }
    hasnode(n: FishNode): boolean { return this.nodemap.has(n.id) }

    addnode(n: FishNode) {
        if (this.nodemap.has(n.id)) return
        this.nodes.push(n)
        this.nodemap.set(n.id, n)
    }

    removenode(n: FishNode) {
        this.nodes.remove(n)
        this.nodemap.delete(n.id)
    }

    togglenode(n: FishNode, add?) {
        add ??= this.hasnode(n)
        if (add) {
            this.addnode(n)
            return true
        } else {
            this.removenode(n)
            return false
        }
    }

    searchnode(nidstart: string): FishNode | undefined {
        nidstart = nidstart.toLowerCase()
        return this.nodes.find(n => n.id.toLowerCase().startsWith(nidstart))
    }

    haslink(l: LinkType): boolean { return this.links.includes(l) }
    appendlink(l: LinkType) { if (!this.haslink(l)) this.links.push(l) }
    appendlinks(ls: LinkType[]) { ls.forEach(this.appendlink) }
    getoutlinks(nid: string) { return this.links.filter(l => l.source == nid) }
    getinlinks(nid: string) { return this.links.filter(l => l.target == nid) }

    get nodecountsByType() { return this.nodes.countBy(n => n.type ?? "") }
    get linkcountsByType() { return this.links.countBy(n => n.type) }

    gettopdegrees(count = 25) { return this.nodes.sortBy(n => -n.degree).slice(0, count) }
    getlinks(nid: string): DirectedLink<LinkType>[] { return this.linkmap.get(nid) ?? [] }
    getneighbors(nid) { return this.getlinks(nid).map(dl => dl.target) }

    minorlinks(majors: Set<string>) {
        return this.links.filter(l => this.isminorlink(majors, l))
    }

    isminorlink(majors: Set<string>, l: ILink): boolean {
        return l.nodeids.every(nid => !majors.has(nid))
    }

    isinnerlink(l: ILink) {
        return (this.getneighbors(l.source).length == 2) && (this.getneighbors(l.target).length == 2)
    }

    innerlinks(majors: Set<string>) {
        return this.minorlinks(majors).filter(l => this.isinnerlink(l))
    }
}

export class GraphAlgos {

    static findpathsmulti<Link extends ILink>(getneighborlinks: (string) => DirectedLink<Link>[], start: string, targets: string[], maxlength = 99, excludes: string[] = []) {

        //console.log("findpathsmulti", start, targets)
        if (!Array.isArray(targets)) throw "targets must be an array!"
        if (typeof start !== "string") throw "start must be a string id"
        if (targets.find(t => typeof t !== "string")) throw "targets must be string ids"

        let stargets = new Set(targets)

        let visited = new Set<string>()
        let goalpaths: Path<Link>[] = []

        const bfs = (fronteer: Path<Link>[]) => {

            let nextfronteer: Path<Link>[] = []
            let reachedtargets: string[] = [] // compute shortest paths only, so remove nodes found at this level from stargets below

            for (let p of fronteer) {
                let n = p.end
                visited.add(n)

                if (stargets.has(n)) {
                    goalpaths.push(p)
                    reachedtargets.push(n)
                }

                getneighborlinks(n)
                    .filter(l => !visited.has(l.target) && !(excludes.includes(l.source) || excludes.includes(l.target)))
                    .map(l => p.with(l))
                    .forEach(p => nextfronteer.push(p))
            }

            reachedtargets.forEach(n => stargets.delete(n))

            let godeeper = fronteer.first.length < 3
            return (godeeper && stargets.size) ? nextfronteer : []
        }

        let fronteer: Path<Link>[] = getneighborlinks(start).map(l => new Path([l]))
        while (fronteer.length && maxlength--) {
            fronteer = bfs(fronteer)
        }

        //console.log("visited", visited.size, "nodes", "found paths", goalpaths)

        return { goalpaths, visited }
    }

    static getfronteers(getneighbors: (string) => string[], start: string, maxlength = 99, excludes: string[] = []) {

        let visited = new Set<string>(excludes) // consider excludes as visited

        const bfs = (fronteer: string[]) => {
            fronteer.forEach(n => visited.add(n))
            return fronteer.flatMap(n => getneighbors(n)).distinct().filter(n => !visited.has(n))
        }

        let fronteers = [] as string[][]
        let f = [start]
        while (f.length && maxlength--) {
            f = bfs(f)
            fronteers.push(f)
        }

        return fronteers
    }


}

mount({ GraphAlgos })