import { cleanid } from "./common"
import { FishLink } from "./fishlink"
import { Mark } from "./mark"

export class FishNode {

    original: MC1Node

    nid: string
    outlinks: FishLink[]
    inlinks: FishLink[]

    constructor(original) {
        this.original = original
        this.nid = cleanid(original.id)
        this.marks = []
    }

    static create(original) { return new FishNode(original) }

    get id() { return this.nid }
    get id10() { return this.nid.truncate(10) }
    get type() { return this.original.type }
    get country() { return this.original.country }
    get outdegree() { return this.outlinks?.length ?? 0}
    get indegree() { return this.inlinks?.length ?? 0}
    get degree() { return this.outdegree + this.indegree}

    toString() { return `FN(${this.nid})` }

    // analysis

    marks: Mark[]

    addmark(mark: Mark) {
        if (this.marks.find(m => m.key == mark.key)) return
        this.marks.push(mark)
    }

    clearmarks() {
        this.marks = []
    }

    get score() {
        let sum = this.marks?.sumBy(m => 1 / m.length) ?? 0
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