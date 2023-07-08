import { FishLink } from "./fishlink"
import { FishNode } from "./fishnode"

// refcount = number of links in this SuperLink

export class SuperLink implements ILink {

    source: string
    target: string
    type: string
    weight: number

    constructor(public links: FishLink[]) {
        let [source, target] = links.first.unodeids
        this.source = source
        this.target = target
    }

    get nodeids() {
        return [this.source, this.target]
    }

    get text() {
        let l = this.links.first
        return `${l.source} -(${this.links.length})> ${l.target}`
    }

    get typeCounts() {
        return this.links.countBy(l => l.type).entries
    }
}
