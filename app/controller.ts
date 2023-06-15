import { initrouter } from "jmx/router"
import { mc1 } from "../data/data"
import { rebind } from "../utils/common"
import { mraw as m } from "./model"
import { updateview } from "jmx/core"
import { Graph } from "../analysis/graph"
import { FishNode } from "../analysis/fishnode"
import { FishLink } from "../analysis/fishlink"
import { Url } from "./routes"

export class Controller {

    constructor() {
        rebind(this)
        m.graph = new Graph(mc1.nodes.map(FishNode.create), mc1.links.map(FishLink.create))
        initrouter(this.setroute)
    }

    setroute() {
        m.url = document.location.pathname.split('/').slice(1) as Url
        console.log("setroute")

        updateview('#main')
    }

    // inc1(ev: PointerEvent) {
    //     m.counter1++
    //     updateview(ev.target as Node)
    //     updateview('#sum')
    // }

    // inc2(ev: PointerEvent) {
    //     m.counter2++
    //     updateview(ev.target as Node)
    //     updateview('#sum')
    // }
}