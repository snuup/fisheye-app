import * as d3 from "d3"
import { initrouter } from "../jmx-lib/router"
import { updateview } from "../jmx-lib/core"
import { mc1 } from "../data/data"
import { mount, rebind } from "../utils/common"
import { mraw as m } from "./model"
import { Graph } from "../elements/graph"
import { FishNode } from "../elements/fishnode"
import { FishLink } from "../elements/fishlink"
import { Url } from "./routes"
import { Path, PathMatrixBuilder } from "../elements/path"
import { Paths } from "../comp/pathmatrix"
import { SuperLink } from "../elements/superlink"
import { cleanid } from "../analysis/common"
//import { SuperGraph } from "../elements/supergraph"

export class Controller {

    constructor() {
        rebind(this)
        this.prepareData()
        initrouter(this.setroute)
    }

    prepareData() {

        let nodes = mc1.nodes.map(FishNode.createFromOriginal)
        let links = mc1.links.map(FishLink.createFromOriginal)
        m.graph = new Graph(nodes, links)
        m.graph.setnodedegrees()

        //problem: supergraph uses nodes and attaches, no, so what ?
        //uncomment next line and see error:
//        m.supergraph = new SuperGraph(m.graph.nodes, m.graph.links)

        // let mb = new PathMatrixBuilder(m.graph)
        // m.tops = mb.initscores(m.investigatees.map(m.graph.getnode))
        // m.top = m.tops[0]

        // m.seagraph = this.getsubgraph(m.investigatees.map(m.graph.getnode))
        // m.netgraph = new GraphView(m.graph)

        //let invs = m.investigatees.map(m.graph.getnode)
        //m.netgraph = new Graph(invs)
    }

    // getsubgraph(nodes: FishNode[]) {
    //     nodes.flatMap(n => n.outlinks)
    //     let links1 = nodes.flatMap(n => n.outlinks).filter(l => l)
    //     let nodes1 = links1.map(l => l.tid).map(m.graph.getnode)
    //     return new Graph(nodes.concat(nodes1).distinctBy(), links1)
    // }

    setroute() {
        m.url = decodeURI(document.location.pathname).split('/').slice(1) as Url
        //console.log("setroute", m.url)

        switch (m.url[0]) {
            // case "network":
            //     this.setfocus(m.url[1])
            //     break
        }

        updateview('#main', false, true)
    }


    // floodsea(levels = 3) {
    //     let g = m.seagraph = this.getsubgraph(m.investigatees.map(m.graph.getnode))
    //     g.nodes.forEach(n => n.up = 0)
    //     let fronteer = m.investigatees.map(g.getnode)
    //     fronteer.forEach(n => n.up = 0.1)
    //     let visited = [] as FishNode[]

    //     function getnode(nid) {
    //         let n = g.getnode(nid)
    //         if (!n) {
    //             n = FishNode.clone(m.graph.getnode(nid))
    //             g.addnode(n)
    //         }
    //         return n
    //     }

    //     function floodfronteer(level) {
    //         console.log("floodfronteer", level)

    //         let nextfronteer: FishNode[] = []

    //         console.log("tbd")

    //         //     fronteer.forEach(n => {
    //         //         if (visited.includes(n)) return
    //         //         visited.push(n)

    //         //         n.outlinks.forEach(l => {

    //         //             // let x
    //         //             // if (typeof l.target === "string") x = getnode(l.target)
    //         //             // if (x == undefined) debugger

    //         //             if (typeof l.target === undefined) debugger
    //         //             if (typeof l.target === "string") l.target = getnode(l.target)

    //         //             l.target.up += n.up! * l.weight
    //         //             if (isNaN(l.target.up)) debugger
    //         //             //console.log("", l.target.up, n.up, l.weight)
    //         //         })
    //         //         nextfronteer.push(...n.outlinks?.map(l => l.target) ?? [])
    //         //         nextfronteer = nextfronteer.distinctBy()

    //         //         fronteer = nextfronteer

    //         //         let illegals = fronteer.filter(n => n.id.includes("llegal"))
    //         //         console.log(illegals.map(n => n.id).join(" + "))

    //         //         // console.log("fronteer", fronteer)
    //         //     })
    //         // }
    //         // for (let i = 1; i <= levels; i++) {
    //         //     floodfronteer(i)
    //     }
    // }

    togglenetnode(ev, n: FishNode) {
        m.netgraph.togglenode(n) // ... create new graph class ? add node, compute path matrix
        this.computepathmatrix()

        let currentkeys = m.pathmatrix.map(ps => ps.key)
        m.selectedpaths.forEach(k => { if (!currentkeys.includes(k)) m.selectedpaths.remove(k) })

        updateview(ev.currentTarget)
        updateview(".network")
    }

    togglepaths(nps: Paths) {
        let active = m.selectedpaths.toggle(nps.key)
        console.log("paths", nps)
        mount({ nps })
        //let links = nps.ps.flatMap(p => p.links)
        //console.log(links)
        //mount({ links })
        // if (active) {
        //     for (let l of links) {
        //         let sl = m.superlinks.getorcreate(l.ukey, () => new SuperLink())
        //         sl.add(l)
        //     }
        // }
        // else {
        //     for (let l of links) {
        //         let sl = m.superlinks.get(l.ukey)!
        //         sl.del(l)
        //     }
        // }
        console.warn("tbd");

        updateview(".path-matrix")
    }

    computepathmatrix() {

        console.log("computepathmatrix")

        let g = m.netgraph
        let nodes = g.nodes
        let n = nodes.length
        let indexes = d3.range(n).flatMap(x => d3.range(x).map(y => [x, y]))

        function computepaths(i): Path[] {
            let { goalpaths } = m.graph.findpathsmulti(nodes[i].id, nodes.slice(i + 1).map(n => n.id))
            return goalpaths
        }

        let allpaths = d3.range(n).flatMap(computepaths)
        console.log("allpaths", allpaths)
        mount({ allpaths })

        function getpaths(i: number, j: number): Paths {
            let n1 = nodes[i]
            let n2 = nodes[j]
            let ps = allpaths.filter(p => p.start == n2.id && p.end == n1.id)
            return new Paths(ps, i, j, n1, n2)
        }

        m.pathmatrix = indexes.map(([i, j]) => getpaths(i, j))
    }
}

export let c = new Controller()

mount({ c })

// make a copy of node for force
// make a link of node for force