import { cleanid } from "./common"
import { FishLink } from "./fishlink"
import { Path } from "./path"

export class FishNode {

    original: MC1Node

    nid: string
    outlinks: FishLink[]
    inlinks: FishLink[]
    paths: Path[]

    x: number
    y: number

    constructor(original) {
        this.original = original
        this.nid = cleanid(original.id)
        this.paths = []
    }

    static create(original) { return new FishNode(original) }

    get id() { return this.nid }
    get id10() { return this.nid.truncate(10) }
    get type() { return this.original.type }
    get country() { return this.original.country }
    get outdegree() { return this.outlinks?.length ?? 0 }
    get indegree() { return this.inlinks?.length ?? 0 }
    get degree() { return this.outdegree + this.indegree }
    get alllinks() { return this.inlinks.concat(this.outlinks) }

    toString() { return `FN(${this.nid})` }

    // analysis

    addpath(mark: Path) {
        if (this.paths.find(m => m.key == mark.key)) return
        this.paths.push(mark)
        this.paths.sortBy(p => p.length)
    }

    clearmarks() {
        this.paths = []
    }

    get score() {
        let sum = this.paths?.sumBy(m => 1 / m.length) ?? 0
        return sum
    }

    _pathsByInv
    get pathsByInv() {
        return this._pathsByInv ?? (this._pathsByInv = this.paths.groupBy(p => p.source))
    }

    get properties() {
        return {
            "prop-header": "node",
            ...this.original,
            score: this.score.toFixed(2)
        }
    }

    get investigatePaths() : Path[][] {
        return Object.values(this.pathsByInv)
    }

    get investigatePaths1() : Path[] {
        return this.investigatePaths.map(ps => ps.first)
    }

    get includeinmatrix() {
        return this.investigatePaths1.filter((p: Path) => p.length <= 2).length > 2
    }

    // higher is better
    get numberOfPathsBetterEqual2(){
        return this.investigatePaths1.filter(p => p.length <= 2).length
    }
}