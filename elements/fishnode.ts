import { mount } from "../utils/common"
import { cleanid } from "../analysis/common"

const linkTypeSortOrder = {
    partnership: 0,
    family_relationship: 1,
    membership: 2,
    ownership: 3,
}

export const linktypes = Object.keys(linkTypeSortOrder)

export interface NodeLinkData {
    type: string,
    outs: number,
    ins: number,
    total: number
}

export class FishNode implements INode {

    original: MC1Node
    id: string

    highlight = false
    focused = false

    get donut(): NodeLinkData[] { return this.original.donut }
    //set donut(d) { }

    get outdegree(): number { return this.donut.sumBy(nd => nd.outs) }
    get indegree(): number { return this.donut.sumBy(nd => nd.ins) }

    private constructor(original: MC1Node) {
        this.original = original
    }

    static createFromOriginal(original: MC1Node): FishNode {
        let n = new FishNode(original)
        n.id = cleanid(original.id)
        return n
    }

    //get id() { return this.nid }
    get type() { return this.original.type }
    get country() { return this.original.country }
    get id10() { return this.id.truncate(10) }
    get degree() { return this.outdegree + this.indegree }
}

mount({ FishNode })