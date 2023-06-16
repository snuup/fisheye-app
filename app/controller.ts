import { initrouter } from "../jmx-lib/router"
import { updateview } from "../jmx-lib/core"
import { mc1 } from "../data/data"
import { rebind } from "../utils/common"
import { mraw as m } from "./model"
import { Graph } from "../analysis/graph"
import { FishNode } from "../analysis/fishnode"
import { FishLink } from "../analysis/fishlink"
import { Url } from "./routes"
import { PathMatrixBuilder } from "../analysis/path"

export class Controller {

    constructor() {
        rebind(this)
        this.prepareData()
        initrouter(this.setroute)
    }

    prepareData() {
        m.graph = new Graph(mc1.nodes.map(FishNode.create), mc1.links.map(FishLink.create))

        m.investigatees =
            [
                "Mar de la Vida OJSC",
                "#979893388",
                "Oceanfront Oasis Inc Carriers",
                "#8327"
            ]
            .map(m.graph.getnode)

        // dev
        window.n = m.investigatees[1]

        let mb = new PathMatrixBuilder(m.graph)
        m.tops = mb.initscores(m.investigatees)
        m.top = m.tops[0]
    }

    setroute() {
        m.url = document.location.pathname.split('/').slice(1) as Url
        console.log("setroute", m.url)

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