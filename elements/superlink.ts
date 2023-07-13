import * as d3 from 'd3'
import { FishLink } from "./fishlink"

type A = [string, string]
let z : A = ["1", "2"]

export class SuperLink implements ILink {

    source: string
    target: string
    type: string
    weight: number
    highlight = false

    constructor(public links: FishLink[]) {
        let l = links.first
        this.source = l.source
        this.target = l.target
    }

    get nodeids() : [string, string] {
        return [this.source, this.target]
    }

    get text() {
        let l = this.links.first
        return `${l.source} -(${this.links.length})> ${l.target}`
    }

    getTypeCounts(links: FishLink[], direction: "in" | "out"): TypeCount[] {
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

    get typeCountsPerSide() {
        let outs = this.getTypeCounts(this.outlinks, "out")
        let ins = this.getTypeCounts(this.inlinks, "in")
        return [outs, ins].filter(a => a.length).map(tcs => ({ tcs, sl: this }))
    }
}

export type TypeCount = {
    type: string,
    count: number,
    countpos: number,
    prevsum: number,
    direction: string
}

// class LinkAdornment {
//     side: "source" | "target"
//     typecounts: any[]
// }

const adornScaler = d3.scaleLinear([1, 2, 3, 10, 100], [4, 9, 12, 20, 50])