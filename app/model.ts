import { FishNode } from "../analysis/fishnode"
import { Graph } from "../analysis/graph"
import { mount } from "../utils/common"
import { Url } from "./routes"

export const mraw = {

    url: ['/'] as Url,

    investigatees: [
        "Mar de la Vida OJSC",
        "n979893388",
        "Oceanfront Oasis Inc Carriers",
        "n8327"
    ],
    entity: "",
    graph: new Graph(),
    selection: [], // ids as string[]
    //linkselection: [], // ?? as string[]
    graphfocus: "" as string | null,
    graphfocusnode: null as FishNode | null,
    subgraph: new Graph(),

    tops: [] as FishNode[],
    top: null as FishNode | null,

    getsubgraphchildren(n: FishNode): FishNode[] {
        return n.outlinks.map(l => m.graph.getnode(l.tid))
    }
}

type Model = typeof mraw
type ModelRO = Readonly<Model>

export const m = mraw as ModelRO

mount({ m })