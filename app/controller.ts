import { initrouter } from "../jmx-lib/router"
import { updateview } from "../jmx-lib/core"
import { mc1 } from "../data/data"
import { mount, rebind } from "../utils/common"
import { mraw as m } from "./model"
import { Graph } from "../analysis/graph"
import { FishNode } from "../analysis/fishnode"
import { FishLink } from "../analysis/fishlink"
import { Url } from "./routes"
import { Path, PathMatrixBuilder } from "../analysis/path"

export class Controller {

    constructor() {
        rebind(this)
        this.prepareData()
        initrouter(this.setroute)
    }

    prepareData() {
        m.graph = new Graph(mc1.nodes.map(FishNode.create), mc1.links.map(FishLink.create))

        let mb = new PathMatrixBuilder(m.graph)
        m.tops = mb.initscores(m.investigatees.map(m.graph.getnode))
        m.top = m.tops[0]

        m.seagraph = this.getsubgraph(m.investigatees.map(m.graph.getnode))
    }

    getsubgraph(nodes: FishNode[]) {
        nodes.flatMap(n => n.outlinks)
        let links1 = nodes.flatMap(n => n.outlinks).filter(l => l)
        let nodes1 = links1.map(l => l.tid).map(m.graph.getnode)
        return new Graph(nodes.concat(nodes1), links1)
    }

    setroute() {
        m.url = decodeURI(document.location.pathname).split('/').slice(1) as Url
        console.log("setroute", m.url)

        switch (m.url[0]) {
            case "graph":
                this.setfocus(m.url[1])
                break
        }

        updateview('#main', false, true)
    }

    setfocus(name) {
        if (!name) return

        m.graphfocus = name
        m.graphfocusnode = m.graph.getnode(m.graphfocus)
        let ls = m.graphfocusnode.investigatePaths.flat().flatMap(p => p.links)
        window.ls = ls

        // all nodes within paths
        let nodes = ls.flatMap(dl => dl.ends).distinctBy().map(m.graph.getnode)
        let links = ls.flatMap(dl => dl.link).distinctBy()

        // just the paths:
        // let paths = m.graphfocusnode.investigatePaths.flatMap(p => [p.source, p.target])
        // let nodes = ls.flatMap(dl => dl.ends).distinctBy().map(m.graph.getnode)
        // let links = ls.flatMap(dl => dl.link).distinctBy()

        m.subgraph = new Graph(nodes, links)
    }

    setinvestigatees() {
        m.graphfocus = null
        m.graphfocusnode = null
        m.investigatees

        // window.ls = ls

        // // all nodes within paths
        // let nodes = ls.flatMap(dl => dl.ends).distinctBy().map(m.graph.getnode)
        // let links = ls.flatMap(dl => dl.link).distinctBy()

        // // just the paths:
        // // let paths = m.graphfocusnode.investigatePaths.flatMap(p => [p.source, p.target])
        // // let nodes = ls.flatMap(dl => dl.ends).distinctBy().map(m.graph.getnode)
        // // let links = ls.flatMap(dl => dl.link).distinctBy()

        // m.subgraph = new Graph(nodes, links)

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
