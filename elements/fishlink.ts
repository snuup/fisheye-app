import * as d3 from "d3"
import { cleanid } from "../analysis/common"
import { FishNode } from "./fishnode"
import { mount } from "../utils/common"

//let strengthScaler = d3.scaleLinear([0, 100], [0, 0.05])

export class FishLink implements ILink {

    original: MC1Link
    source: string
    target: string

    // get strength(): number {
    //     return strengthScaler(this.minz * this.weight)
    // }

    // get maxz() {
    //     return Math.max(this.source.z, this.target.z)
    // }

    // get minz() {
    //     return Math.min(this.source.z, this.target.z)
    // }

    // get avgz() {
    //     return [this.source.z, this.target.z].average
    // }

    constructor(original) {
        this.original = original
    }

    // static clone(o: FishLink) {
    //     let l = new FishLink(o.original)
    //     Object.assign(l, o)
    //     return l
    // }

    static createFromOriginal(original) {
        let l = new FishLink(original)
        l.source = cleanid(original.source)
        l.target = cleanid(original.target)
        return l
    }

    get key() { return this.source + "|" + this.target }
    get ukey() { return this.nodeids.sort().join("|") }
    get type() { return this.original.type }
    get weight() { return this.original.weight }
    get nodes() { return [this.source, this.target] }
    get nodeids() { return [this.source, this.target] }
    get unodeids() { return [this.source, this.target].sort() }

    toString() {
        return `${this.source} -> ${this.target}`
    }

    get text() {
        return `${this.source} -(${this.type} / ${this.weight})> ${this.target}`
    }
}

export class DirectedLink<LinkType extends ILink> {

    constructor(public link: LinkType, public rev: boolean) {
        this.link = link
        this.rev = rev
    }

    //get key() { return this.link.key + "|" + this.rev.toString() }
    //get original() { return this.link.original }
    //get nodes() { return this.link.nodeids }

    get source() { return this.rev ? this.link.target : this.link.source }
    get target() { return this.rev ? this.link.source : this.link.target }
    get ends() { return [this.source, this.target] }

    get text() { return this.source + " - " + this.target }
    //get longtext() { return this.source + ` (${this.original.type}/${this.original.weight}) ` + this.target }
    //get longtext1() { return this.source + ` (${this.original.type}/${this.original.weight}) ` }
}

mount({ FishLink })