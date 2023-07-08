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

    getTypeCounts(links: FishLink[], direction: string) {
        let prevsum = 0
        return links.countBy(l => l.type).entries.map(([type, count]) => {
            let r = { type, count, prevsum, direction }
            prevsum += count
            return r
        })
    }

    get outlinks() { return this.links.filter(l => l.source == this.source) }
    get inlinks() { return this.links.filter(l => l.source == this.target) }

    get typeCounts() {
        return this.getTypeCounts(this.outlinks, "out").concat(this.getTypeCounts(this.inlinks, "in"))
    }
}
