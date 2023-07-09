import * as d3 from 'd3'
import { FishLink } from "./fishlink"

export class SuperLink implements ILink {

    source: string
    target: string
    type: string
    weight: number
    highlight = false

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
            let r = { type, count, countpos: adornScaler(count), prevsum, direction } // * 2 is a rude visual scaler
            prevsum += count
            return r
        })
    }

    get outlinks() { return this.links.filter(l => l.source == this.source) }
    get inlinks() { return this.links.filter(l => l.source == this.target) }

    get typeCounts() {
        return this.getTypeCounts(this.outlinks, "out").concat(this.getTypeCounts(this.inlinks, "in"))
    }

    get arrows(): { pos: number, direction: string }[] {
        let outs = this.getTypeCounts(this.outlinks, "out")
        let ins = this.getTypeCounts(this.inlinks, "in")
        let a = [] as any[]
        if (ins.length) a.push({ pos: ins.last.countpos, direction: "in" })
        if (outs.length) a.push({ pos: outs.last.countpos, direction: "out" })
        return a
    }
}

const adornScaler = d3.scaleLinear([1, 2, 3, 10, 100], [4, 9, 12, 20, 50])