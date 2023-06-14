import { cleanid } from "./common"

export class FishLink {

    original: MC1Link

    // stable data processing
    sid: string
    tid: string

    source: string | any // nid, reassigned by d3
    target: string | any // nid, reassigned by d3

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
}