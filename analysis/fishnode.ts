import { cleanid } from "./common"
import { FishLink } from "./fishlink"
import { Path } from "./path"

export class FishNode {

    original: MC1Node

    nid: string
    outlinks: FishLink[]
    inlinks: FishLink[]
    paths: Path[]

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

    get pathsByInv() {
        return this.paths.groupBy(p => p.source)
    }

    get properties() {
        return {
            "prop-header": "node",
            ...this.original,
            score: this.score.toFixed(2)
        }
    }

    // return this.g.nodes
    //         .filter(n => n.paths.filter(p => p.length <= 2).map(p => p.source).distinctBy().length > 2)
    //         .sortBy(n => n.paths.filter(p => p.length <= 2).map(p => p.source).distinctBy().length)
}