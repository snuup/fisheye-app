import * as d3 from "d3"
import { initrouter } from "../jmx-lib/router"
import { updateview, updateviewmany } from "../jmx-lib/core"
import { mc1 } from "../data/data"
import { mount, rebind } from "../utils/common"
import { mraw as m } from "./model"
import { Graph, GraphAlgos } from "../elements/graph"
import { FishNode } from "../elements/fishnode"
import { FishLink } from "../elements/fishlink"
import { Url } from "./routes"
import { Path, PathMatrixBuilder } from "../elements/path"
import { Paths } from "../networkview/pathmatrix"
import { SuperLink } from "../elements/superlink"
import { getlinkgroupkey, issuspicious } from "../analysis/common"
import "../analysis/agg"


export class Controller {

    constructor() {
        rebind(this)
        this.prepareData()
        initrouter(this.setroute)
    }

    prepareData() {

        let nodes: FishNode[] = mc1.nodes.map(o => new FishNode(o))
        let links: FishLink[] = mc1.links.map(o => new FishLink(o))
        m.graph = new Graph(nodes, links)
        let g = m.graph

        let superlinks = links.groupBy(l => l.ukey).values().map(ls => new SuperLink(ls))
        m.supergraph = new Graph(nodes, superlinks)

        m.invs = m.investigatees.map(m.graph.getnode)
        m.suspects = m.graph.nodes.filter(n => issuspicious(n.id))

        this.restore()
        this.computepathmatrix()
        this.updatenetgraph()

        links.forEach(l => {
            l.sourcetype = g.getnode(l.source).type ?? "undefined"
            l.targettype = g.getnode(l.target).type ?? "undefined"
        })
        m.linkgroups =
            m.graph.links
                .groupBy(l => l.type)
                .mapValues(ls => ls.groupBy(l => getlinkgroupkey(l.sourcetype, l.targettype)))

        nodes.forEach(n => n.inv = m.invs.includes(n))
        nodes.forEach(n => n.suspect = m.suspects.includes(n))
        m.netgraph.nodes = m.invs.slice(0, 222) // .concat(m.suspects)

        // init country color scaler
        // let allcountries = nodes.map(n => n.country).distinctBy().map(s => s ?? "undefined")
        m.countryColorScaler = d3.scaleOrdinal(d3.schemeAccent) // d3.scaleOrdinal().domain(allcountries)
    }

    getfronteer(nid: string, max) {
        return GraphAlgos.getfronteers(m.supergraph.getneighbors, nid, max, ["FishEye International"])
    }

    setroute() {
        m.url = decodeURI(document.location.pathname).split('/').slice(1) as Url
        console.log("setroute", m.url)



        // switch (m.url[0]) {
        //     case "network":
        //         this.setfocus(m.url[1])
        //         break
        // }

        // debugger
        updateview(document.body, false, true)
        //updateview("header", false, false)
        //updateview('#main', undefined, true) // replace!! non replace does not work: to debug
    }

    togglenetnode(ev, n: FishNode) {
        let add = m.pinnednodes.toggle(n)
        this.updateAfterNodeToggle(ev.currentTarget)
    }

    updateAfterNodeToggle(e: Node) {
        this.computepathmatrix()
        //m.pinnedpaths = m.pathmatrix.map(p => p.key)
        this.updatenetgraph()

        //let currentkeys = m.pathmatrix.map(ps => ps.key)
        //m.pinnedpaths.forEach(k => { if (!currentkeys.includes(k)) m.pinnedpaths.remove(k) })

        updateviewmany(e, ".network") // ".net-graph > svg", ".path-matrix")
        //updateview(".network")
        this.store()
    }

    // removepinnednode(n: FishNode) {
    //     let add = m.pinnednodes.toggle(n)
    //     //m.netgraph.togglenode(n, add) // ... create new graph class ? add node, compute path matrix

    //     this.computepathmatrix()
    //     this.updatenetgraph()

    //     let currentkeys = m.pathmatrix.map(ps => ps.key)
    //     m.pinnedpaths.forEach(k => { if (!currentkeys.includes(k)) m.pinnedpaths.remove(k) })

    //     updateviewmany(ev.currentTarget, ".net-graph > svg")
    //     this.store()
    // }

    togglepaths(nps: Paths) {
        m.pinnedpaths.toggle(nps.key)
        this.updatenetgraph()
        updateview('.path-matrix')
        updateview('.net-graph > svg')
        this.store()
    }

    updatenetgraph() {
        // let ps = m.pathmatrix.filter(ps => m.pinnedpaths.includes(ps.key))
        // let links = ps.flatMap(p => p.ps).flatMap(p => p.links).map(dl => dl.link).distinct()
        // let nodes = links.flatMap(l => l.nodeids.map(nid => m.graph.getnode(nid))).concat(m.pinnednodes).distinct()
        //m.netgraph.nodes = m.pinnednodes
        m.netgraph.links = [] // links
        m.netgraph.fixup()
    }

    computepathmatrix() {

        //console.log("computepathmatrix")

        let nodes = m.pinnednodes
        let n = nodes.length
        let indexes = d3.range(n).flatMap(x => d3.range(x).map(y => [x, y]))

        function computepaths(i): Path<SuperLink>[] {
            let { goalpaths } = GraphAlgos.findpathsmulti(m.supergraph.getlinks, nodes[i].id, nodes.slice(i + 1).map(n => n.id))
            return goalpaths
        }

        let allpaths = d3.range(n).flatMap(computepaths)
        //console.log("allpaths", allpaths)
        mount({ allpaths })

        function getpaths(i: number, j: number): Paths {
            let n1 = nodes[i]
            let n2 = nodes[j]
            let ps = allpaths.filter(p => p.start == n2.id && p.end == n1.id)
            return new Paths(ps, i, j, n1, n2)
        }

        m.pathmatrix = indexes.map(([i, j]) => getpaths(i, j))
    }

    highlightbadpaths(n: FishNode) {
        console.log("highlightbadpaths", n)

        this.resethighlights()

        n.focused = true

        document.body.classList.add("highlightpaths")
        let bads = m.netgraph.nodes.filter(n => m.suspects.includes(n)).map(n => n.id)
        let { goalpaths } = GraphAlgos.findpathsmulti(m.supergraph.getlinks, n.id, bads, 3, ['FishEye International'])
        //console.log("goalpaths", goalpaths)
        mount({ goalpaths })

        let highlightlinks = goalpaths.flat().flatMap(p => p.links).map(dl => dl.link).distinct()
        highlightlinks.forEach(l => l.highlight = true)
        console.log("highlighted links:", highlightlinks)

        let highlightnodes = highlightlinks.flatMap(l => l.nodeids).distinct()
        m.netgraph.nodes.forEach(n => n.highlight = highlightnodes.includes(n.id))

        //console.log("highlightlinks", highlightlinks)
        //console.log("highlightnodes", highlightnodes)
        //console.log("highs-focs:", m.netgraph.nodes.map(n => `${n.highlight} - ${n.focused}`).join(' '))

        this.storenetgraph()
        updateview('.net-graph > svg')
    }

    resethighlights() {
        //console.log("resethighlights")

        m.netgraph.links.forEach(l => l.highlight = false)
        m.netgraph.nodes.forEach(n => {
            n.focused = false
            n.highlight = false
        })
        this.storenetgraph()

        this.printhfs(1)

        document.body.classList.remove("highlightpaths")
        updateview('.net-graph > svg')

        this.printhfs(2)
    }

    store() {
        return
        localStorage.setItem("session", JSON.stringify({
            pinnednodes: m.pinnednodes.map(n => n.id),
            pinnedpaths: m.pinnedpaths
        }))
    }

    restore() {
        return
        let json = localStorage.getItem("session")
        if (!json) return
        let o = JSON.parse(json)
        m.pinnednodes = o.pinnednodes.map(nid => m.graph.getnode(nid))
        m.pinnedpaths = o.pinnedpaths
    }

    storenetgraph() {
        return
        localStorage.setItem("netgraph", JSON.stringify(m.netgraph.nodes))
        //console.log("stored")
        this.printhfs()
    }

    restorenetgraph() {
        return
        let json = localStorage.getItem("netgraph")
        if (!json) return
        let ns = JSON.parse(json)
        // ns.forEach(n => n.donut = m.graph.getnode(n.id).donut) // fixup
        let nodemap = new Map(ns.map(n => [n.id, n]))
        m.netgraph.nodes.forEach(n => Object.assign(n, nodemap.get(n.id)))
        //console.log("restored")
        this.printhfs()
    }

    printhfs(msg?) {
        // console.log("printhfs", msg)
        // for (let n of m.netgraph.nodes) {
        //     if (n.highlight) console.log("high", n.id)
        //     if (n.focused) console.log("focs", n.id)
        // }
    }
}

export let c = new Controller()

mount({ c })

// make a copy of node for force
// make a link of node for force