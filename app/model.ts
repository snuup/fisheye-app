import { FishNode } from "../analysis/fishnode"
import { Graph } from "../analysis/graph"
import { mount } from "../utils/common"
import { Url } from "./routes"

export const mraw = {

    url: ['stats'] as Url,

    investigatees: [] as FishNode[],
    entity: "",
    graph: new Graph(),
    selection: [], // ids as string[]
    //linkselection: [], // ?? as string[]


}

type Model = typeof mraw
type ModelRO = Readonly<Model>

export const m = mraw as ModelRO

mount({ m })