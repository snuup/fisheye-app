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
                "n979893388",
                "Oceanfront Oasis Inc Carriers",
                "n8327"
            ]
                .map(m.graph.getnode)

        // dev
        window.n = m.investigatees[1]

        let mb = new PathMatrixBuilder(m.graph)
        m.tops = mb.initscores(m.investigatees)
        m.top = m.tops[0]
    }

    setroute() {
        m.url = decodeURI(document.location.pathname).split('/').slice(1) as Url
        console.log("setroute", m.url)

        switch (m.url[0]) {
            case "graph":
                m.graphfocus = m.url[1]
                if (m.graphfocus) {
                    m.graphfocusnode = m.graph.getnode(m.graphfocus)
                    let ls = m.graphfocusnode.investigatePaths.flat().flatMap(p => p.links)
                    window.ls = ls
                    let nodes = ls.flatMap(dl => dl.ends).distinctBy().map(m.graph.getnode)
                    let links = ls.flatMap(dl => dl.link).distinctBy()
                    m.subgraph = new Graph(nodes, links)
                }
                else {
                    m.graphfocusnode = undefined
                }


                break
        }

        updateview('#main', false, true)
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