import * as d3 from 'd3'
import { FishNode } from "../elements/fishnode"
import { Graph } from "../elements/graph"
import { SuperLink } from "../elements/superlink"
import { Paths } from "../networkview/pathmatrix"
import { mount } from "../utils/common"
import { Url } from "./routes"
import { FishLink } from "../elements/fishlink"
import { AGraph } from '../analysis/agg'

type LinkGroup = {
    [keys in LinkType]: {
        [connects: string]: FishLink[]
    }
}

export type FishGraph = Graph<FishNode, SuperLink>

export const mraw = {

    url: ['nodestats'] as Url,

    investigatees: [
        "Mar de la Vida OJSC",
        "n979893388",
        "Oceanfront Oasis Inc Carriers",
        "n8327"
    ],

    entity: "",

    graph: Graph.Empty as Graph<FishNode, FishLink>,
    linkgroups: {} as LinkGroup,

    supergraph: Graph.Empty as FishGraph,
    netgraph: Graph.Empty as FishGraph,
    agraph: Graph.Empty as AGraph,

    //pinnednodes: [] as FishNode[],
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

    invs: [] as FishNode[],
    suspects: [] as FishNode[],
    get majorids() { return new Set(m.invs.concat(m.suspects).map(n => n.id)) },
    get majors() { return m.invs.concat(m.suspects) },

    countryColorScaler: d3.scaleOrdinal(d3.schemeAccent)
}

type Model = typeof mraw
type ModelRO = Readonly<Model>

export const m = mraw as ModelRO

mount({ m })