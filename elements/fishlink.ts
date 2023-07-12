import { cleanid } from "../analysis/common"
import { mount } from "../utils/common"

export class FishLink implements ILink {

    original: MC1Link
    source: string
    target: string
    sourcetype: string
    targettype: string

    constructor(original) {
        this.original = original
        this.source = cleanid(original.source)
        this.target = cleanid(original.target)
    }

    get key() { return this.source + "|" + this.target }
    get ukey() { return this.nodeids.sort().join("|") }
    get type() { return this.original.type }
    get weight() { return this.original.weight }
    get nodes() { return [this.source, this.target] }
    get nodeids() { return [this.source, this.target] }

    toString() { return `${this.source} -> ${this.target}` }
    get text() { return `${this.source} -(${this.type} / ${this.weight})> ${this.target}` }
}

export class DirectedLink<LinkType extends ILink> {

    constructor(public link: LinkType, public rev: boolean) {
        this.link = link
        this.rev = rev
    }

    get source() { return this.rev ? this.link.target : this.link.source }
    get target() { return this.rev ? this.link.source : this.link.target }
    get ends() { return [this.source, this.target] }
    get text() { return this.source + " - " + this.target }
}

mount({ FishLink })