import { mount } from "../utils/common"
import { cleanid } from "../analysis/common"

export class FishNode implements INode {

    original: MC1Node
    id: string
    highlight = false
    focused = false
    pinned = false

    inv?: boolean
    suspect?: boolean

    home?: { x: number, y: number }

    constructor(original: MC1Node) {
        this.original = original
        this.id = cleanid(original.id)
    }

    get donut(): NodeLinkData[] { return this.original.donut }
    get outdegree(): number { return this.donut.sumBy(nd => nd.outs) }
    get indegree(): number { return this.donut.sumBy(nd => nd.ins) }
    get type(): NodeType | undefined { return this.original.type }
    get country() { return this.original.country }
    get id10() { return this.id.truncate(10) }
    get degree() { return this.outdegree + this.indegree }
}

mount({ FishNode })