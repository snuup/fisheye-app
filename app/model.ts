import { FishNode } from "../analysis/fishnode"
import { Graph, GraphView } from "../analysis/graph"
import { SuperGraph } from "../analysis/supergraph"
import { SuperLink } from "../analysis/superlink"
import { NodePaths } from "../comp/pathmatrix"
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

    supergraph: SuperGraph.Empty,

    graphfocus: "" as string | null,
    graphfocusnode: null as FishNode | null,
    subgraph: Graph.Empty, // old force view (is in draft)

    seagraph: Graph.Empty,

    netgraph: GraphView.Empty,
    selectedpaths: [] as string[],

    tops: [] as FishNode[],
    top: null as FishNode | null,

    pathmatrix: [] as NodePaths[],
    superlinks: new Map<string, SuperLink>(),

    getsubgraphchildren(n: FishNode): FishNode[] {
        return n.outlinks.map(l => m.graph.getnode(l.tid))
    }
}

type Model = typeof mraw
type ModelRO = Readonly<Model>

export const m = mraw as ModelRO

mount({ m })