import { FishNode } from "../elements/fishnode"
import { Graph } from "../elements/graph"
import { SuperLink } from "../elements/superlink"
import { Paths } from "../comp/pathmatrix"
import { mount } from "../utils/common"
import { Url } from "./routes"
import { FishLink } from "../elements/fishlink"

export const mraw = {

    url: ['/'] as Url,

    investigatees: [
        "Mar de la Vida OJSC",
        "n979893388",
        "Oceanfront Oasis Inc Carriers",
        "n8327"
    ],
    entity: "",
    graph: Graph.Empty as Graph<FishLink>,
    supergraph: Graph.Empty as Graph<SuperLink>,

    netgraph: Graph.Empty as Graph<SuperLink>,

    pinnednodes: [] as FishNode[],
    pinnedpaths: [] as string[],

    graphfocus: "" as string | null,
    graphfocusnode: null as FishNode | null,
    subgraph: Graph.Empty, // old force view (is in draft)
    seagraph: Graph.Empty,

    tops: [] as FishNode[],
    top: null as FishNode | null,

    pathmatrix: [] as Paths[],
    //superlinks: new Map<string, SuperLink>(),

    // ui
    selection: [] as any[],

    suspects: [] as FishNode[]
}

type Model = typeof mraw
type ModelRO = Readonly<Model>

export const m = mraw as ModelRO

mount({ m })