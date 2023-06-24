import * as d3 from "d3"
import { cleanid } from "./common"

let strengthScaler = d3.scaleLinear([0, 100], [0, 0.05])

export class FishLink {

    original: MC1Link

    // stable data processing
    sid: string
    tid: string

    source: string | any // nid, reassigned by d3
    target: string | any // nid, reassigned by d3

    get strength(): number {
        return strengthScaler(this.minz * this.weight)
    }

    get maxz() {
        return Math.max(this.source.z, this.target.z)
    }

    get minz() {
        return Math.min(this.source.z, this.target.z)
    }

    get avgz() {
        return [this.source.z, this.target.z].average
    }

    constructor(original) {
        this.original = original
        this.sid = this.source = cleanid(original.source)
        this.tid = this.target = cleanid(original.target)
    }

    static create(original) { return new FishLink(original) }

    get key() { return this.sid + "|" + this.tid }
    get type() { return this.original.type }
    get weight() { return this.original.weight }
    get nodes() { return [this.sid, this.tid] }

    toString() {
        return `${this.sid} -> ${this.tid}`
    }

    get text() {
        return `${this.sid} -(${this.type} / ${this.weight})> ${this.tid}`
    }
}