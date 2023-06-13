import { Graph } from "../analysis/graph"
import { mount } from "../utils/common"

export const mraw = {
    investigatees:
    [
        "Mar de la Vida OJSC",
        "#979893388",
        "Oceanfront Oasis Inc Carriers",
        "#8327",
        //"all"
    ],
    entity: "",
    graph: new Graph(),
    selection: [], // ids as string[]
    //linkselection: [], // ?? as string[]


}

type Model = typeof mraw
type ModelRO = Readonly<Model>

export const m = mraw as ModelRO

mount({ m })