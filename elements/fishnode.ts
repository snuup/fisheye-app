import { mount } from "../utils/common"
import { cleanid } from "../analysis/common"

const linkTypeSortOrder = {
    partnership: 0,
    family_relationship: 1,
    membership: 2,
    ownership: 3,
}

export const linktypes = Object.keys(linkTypeSortOrder)

export interface NodeLinkData {
    type: string,
    outs: number,
    ins: number,
    total: number
}

export class FishNode implements INode {

    original: MC1Node
    id: string
    outdegree: number
    indegree: number
    isinv?: boolean
    donut: NodeLinkData[]

    private constructor(original: MC1Node) {
        this.original = original
        //this.nid = cleanid(original.id)
        //this.paths = []
    }

    static createFromOriginal(original: MC1Node): FishNode {
        let n = new FishNode(original)
        n.id = cleanid(original.id)
        return n
    }

    // setgraphvalues(nid, outdegree, indegree) {
    //     // out/in/total degrees
    // }

    // static create(original) { return new FishNode(original) }

    // static clone(o: FishNode) {
    //     let n = new FishNode(o.original)
    //     Object.assign(n, o)
    //     n.outlinks = o.outlinks.map(FishLink.clone)
    //     n.inlinks = o.inlinks.map(FishLink.clone)
    //     return n
    // }

    //get id() { return this.nid }
    get type() { return this.original.type }
    get country() { return this.original.country }
    get id10() { return this.id.truncate(10) }
    get degree() { return this.outdegree + this.indegree }

    // tbd
    // get outdegree() { return this.outlinks?.length ?? 0 }
    // get indegree() { return this.inlinks?.length ?? 0 }
    // get degree() { return this.outdegree + this.indegree }

    // get allneighbors(): FishNode[] { return this.outlinks.map(l => l.target as FishNode).concat(this.inlinks.map(l => l.source as FishNode)) }

    // get upfixed2() { return this.up.toFixed(2) }

    // toString() { return `FN(${this.nid})` }

    // // accessors

    // getneighborlink(n: FishNode) {
    //     return this.outlinks.find(l => l.target === n) ?? this.inlinks.find(l => l.source === n)!
    // }

    // // analysis

    // addpath(mark: Path) {
    //     if (this.paths.find(m => m.key == mark.key)) return
    //     this.paths.push(mark)
    //     this.paths.sortBy(p => p.length)
    // }

    // clearmarks() {
    //     this.paths = []
    // }

    // get score() {
    //     let sum = this.paths?.sumBy(m => 1 / m.length) ?? 0
    //     return sum
    // }

    // _pathsByInv
    // get pathsByInv() {
    //     return this._pathsByInv ?? (this._pathsByInv = this.paths.groupBy(p => p.source))
    // }

    // get properties() {
    //     return {
    //         "prop-header": "node",
    //         ...this.original,
    //         score: this.score.toFixed(2)
    //     }
    // }

    // get investigatePaths(): Path[][] {
    //     return Object.values(this.pathsByInv)
    // }

    // get investigatePaths1(): Path[] {
    //     return this.investigatePaths.map(ps => ps.first)
    // }

    // get includeinmatrix() {
    //     return this.investigatePaths1.filter((p: Path) => p.length <= 2).length > 2
    // }

    // // higher is better
    // get numberOfPathsBetterEqual2() {
    //     return this.investigatePaths1.filter(p => p.length <= 2).length
    // }
}

mount({ FishNode })