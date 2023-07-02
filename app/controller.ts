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
        return new Graph(nodes.concat(nodes1).distinctBy(), links1)
    }

    setroute() {
        m.url = decodeURI(document.location.pathname).split('/').slice(1) as Url
        //console.log("setroute", m.url)

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

    floodsea(levels = 3) {
        let g = m.seagraph = this.getsubgraph(m.investigatees.map(m.graph.getnode))
        g.nodes.forEach(n => n.up = 0)
        let fronteer = m.investigatees.map(g.getnode)
        fronteer.forEach(n => n.up = 0.1)
        let visited = [] as FishNode[]

        function getnode(nid) {
            let n = g.getnode(nid)
            if (!n) {
                n = FishNode.clone(m.graph.getnode(nid))
                g.addnode(n)
            }
            return n
        }

        function floodfronteer(level) {
            console.log("floodfronteer", level)

            let nextfronteer: FishNode[] = []

            console.log("tbd")

            //     fronteer.forEach(n => {
            //         if (visited.includes(n)) return
            //         visited.push(n)

            //         n.outlinks.forEach(l => {

            //             // let x
            //             // if (typeof l.target === "string") x = getnode(l.target)
            //             // if (x == undefined) debugger

            //             if (typeof l.target === undefined) debugger
            //             if (typeof l.target === "string") l.target = getnode(l.target)

            //             l.target.up += n.up! * l.weight
            //             if (isNaN(l.target.up)) debugger
            //             //console.log("", l.target.up, n.up, l.weight)
            //         })
            //         nextfronteer.push(...n.outlinks?.map(l => l.target) ?? [])
            //         nextfronteer = nextfronteer.distinctBy()

            //         fronteer = nextfronteer

            //         let illegals = fronteer.filter(n => n.id.includes("llegal"))
            //         console.log(illegals.map(n => n.id).join(" + "))

            //         // console.log("fronteer", fronteer)
            //     })
            // }
            // for (let i = 1; i <= levels; i++) {
            //     floodfronteer(i)
        }
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

    // network

    togglenetnode(ev, n: FishNode) {
        m.netgraph.togglenode(n) // ... create new graph class ? add node, compute path matrix
        updateview(ev.currentTarget)
        updateview(".network")
    }
}

export let c = new Controller()

mount({ c })