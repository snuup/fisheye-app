import * as d3 from "d3"
import { initrouter } from "../jmx-lib/router"
import { updateview, updateviewmany } from "../jmx-lib/core"
import { mc1 } from "../data/data"
import { mount, rebind } from "../utils/common"
import { mraw as m } from "./model"
import { Graph, GraphAlgos, printpath } from "../elements/graph"
import { FishNode } from "../elements/fishnode"
import { FishLink } from "../elements/fishlink"
import { Url } from "./routes"
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

        m.invs.forEach(n => n.role = "inv")
        m.suspects.forEach(n => n.role = "sus")

        // init country color scaler
        // let allcountries = nodes.map(n => n.country).distinctBy().map(s => s ?? "undefined")
        m.countryColorScaler = d3.scaleOrdinal(d3.schemeAccent) // d3.scaleOrdinal().domain(allcountries)
    }

    getfronteers(nid: string, max = 90) {
        return GraphAlgos.getfronteers(m.supergraph.getneighbors, nid, max, ["FishEye International"])
    }

    getdistance(start: string, goal: string) {
        return GraphAlgos.getdistance(m.supergraph.getneighbors, start, goal, 90, ["FishEye International"])
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
        console.log("togglenetnode")
        n.pinned = !n.pinned

        this.updatelinks(n)
        updateview("article")
    }

    updatelinks(n: FishNode) {
        if (n.pinned) {
            m.netgraph.nodes.push(n)

            console.warn("add links between", n.id, m.netgraph.nodes)
            let paths = GraphAlgos.findpathsmulti(m.supergraph.getlinks, n.id, m.netgraph.nodes.filter(n => n.role == "inv").map(n => n.id).except(n.id))
            console.log("paths", paths.map(p => p.length))

            paths.forEach(printpath)

            let links = paths.flatMap(p => p.links.map(dl => dl.link)).distinct()
            let internodes =
                links
                    .flatMap(l => l.nodeids)
                    .distinct()
                    .exceptset(m.majorids)
                    .map(nid => m.supergraph.getnode(nid))
                    .filter(n => n.role === undefined) // only add nodes that are not yet already internodes

            internodes.forEach(n => n.role = "inter")

            m.netgraph.nodes.push(...internodes)
            m.netgraph.links.ensures(links)

            console.log(links)
        }
        else {
            console.warn("tbd: remove links to", n.id)
            m.netgraph.nodes.remove(n)
        }
    }

    updateAfterNodeToggle(e: Node) {
        this.computepathmatrix()
        m.pinnedpaths = m.pathmatrix.map(p => p.key)
        this.updatenetgraph()

        //let currentkeys = m.pathmatrix.map(ps => ps.key)
        //m.pinnedpaths.forEach(k => { if (!currentkeys.includes(k)) m.pinnedpaths.remove(k) })

        updateviewmany(e, ".network") // ".net-graph > svg", ".path-matrix")
        //updateview(".network")
    }

    selectnode(n: FishNode) {

        n.selected = m.selection.toggle(n)
        m.selection.removeif(x => x !== n).forEach(n => n.selected = false)

        this.updateslectiondistances()

        console.log("suspectdistances", m.suspectdistances)
        updateview("article")

        m.selection.map(n => n.id).print()
    }

    updateslectiondistances() {
        let firstselect: FishNode | undefined = m.selection[0]
        m.suspectdistances = new Map()
        if (firstselect) {
            for (let sus of m.suspects) {
                let d = c.getdistance(firstselect.id, sus.id)
                m.suspectdistances.set(sus.id, d)
            }
        }
        this.adornsuspectdistances()
    }

    adornsuspectdistances() {
        m.supergraph.nodes.forEach(n => {
            n.suspectdistance = m.suspectdistances.get(n.id)
        })
    }

    togglepaths(nps: Paths) {
        m.pinnedpaths.toggle(nps.key)
        this.updatenetgraph()
        updateview('.path-matrix')
        updateview('.net-graph > svg')
    }

    updatenetgraph() {

        // let ps = m.pathmatrix.filter(ps => m.pinnedpaths.includes(ps.key))
        // let links = ps.flatMap(p => p.ps).flatMap(p => p.links).map(dl => dl.link).distinct()
        // let nodes = links.flatMap(l => l.nodeids.map(nid => m.graph.getnode(nid))).concat(m.pinnednodes).distinct()
        // m.netgraph.nodes = nodes

        // m.netgraph.nodes.forEach(n => n.isinter = !m.majors.includes(n))

        // m.netgraph.links = links
        // m.netgraph.fixup()
    }

    computepathmatrix() {

        //console.log("computepathmatrix")

        // let nodes = m.pinnednodes
        // let n = nodes.length
        // let indexes = d3.range(n).flatMap(x => d3.range(x).map(y => [x, y]))

        // function computepaths(i): Path<SuperLink>[] {
        //     let { goalpaths } = GraphAlgos.findpathsmulti(m.supergraph.getlinks, nodes[i].id, nodes.slice(i + 1).map(n => n.id))
        //     return goalpaths
        // }

        // let allpaths = d3.range(n).flatMap(computepaths)
        // //console.log("allpaths", allpaths)
        // mount({ allpaths })

        // function getpaths(i: number, j: number): Paths {
        //     let n1 = nodes[i]
        //     let n2 = nodes[j]
        //     let ps = allpaths.filter(p => p.start == n2.id && p.end == n1.id)
        //     return new Paths(ps, i, j, n1, n2)
        // }

        // m.pathmatrix = indexes.map(([i, j]) => getpaths(i, j))
    }

    // highlightbadpaths(n: FishNode) {
    //     console.log("highlightbadpaths", n)

    //     this.resethighlights()

    //     n.focused = true

    //     document.body.classList.add("highlightpaths")
    //     let bads = m.netgraph.nodes.filter(n => m.suspects.includes(n)).map(n => n.id)
    //     let { goalpaths } = GraphAlgos.findpathsmulti(m.supergraph.getlinks, n.id, bads, 3, ['FishEye International'])
    //     //console.log("goalpaths", goalpaths)
    //     mount({ goalpaths })

    //     let highlightlinks = goalpaths.flat().flatMap(p => p.links).map(dl => dl.link).distinct()
    //     highlightlinks.forEach(l => l.highlight = true)
    //     console.log("highlighted links:", highlightlinks)

    //     let highlightnodes = highlightlinks.flatMap(l => l.nodeids).distinct()
    //     m.netgraph.nodes.forEach(n => n.highlight = highlightnodes.includes(n.id))

    //     //console.log("highlightlinks", highlightlinks)
    //     //console.log("highlightnodes", highlightnodes)
    //     //console.log("highs-focs:", m.netgraph.nodes.map(n => `${n.highlight} - ${n.focused}`).join(' '))

    //     this.storenetgraph()
    //     updateview('.net-graph > svg')
    // }

    // resethighlights() {
    //     //console.log("resethighlights")

    //     m.netgraph.links.forEach(l => l.highlight = false)
    //     m.netgraph.nodes.forEach(n => {
    //         n.focused = false
    //         n.highlight = false
    //     })
    //     this.storenetgraph()

    //     this.printhfs(1)

    //     document.body.classList.remove("highlightpaths")
    //     updateview('.net-graph > svg')

    //     this.printhfs(2)
    // }

    // store() {
    //     return
    //     localStorage.setItem("session", JSON.stringify({
    //         pinnednodes: m.pinnednodes.map(n => n.id),
    //         pinnedpaths: m.pinnedpaths
    //     }))
    // }

    // restore() {
    //     return
    //     let json = localStorage.getItem("session")
    //     if (!json) return
    //     let o = JSON.parse(json)
    //     m.pinnednodes = o.pinnednodes.map(nid => m.graph.getnode(nid))
    //     m.pinnedpaths = o.pinnedpaths
    // }

    storenetgraph() {
        console.log("storenetgraph")
        let o = {
            selection: m.selection.map(n => n.id),
            majors: m.majors,
            netnodes: m.netgraph.nodes,
            netlinks: m.netgraph.links
        }
        localStorage.setItem("o", JSON.stringify(o))
    }

    restorenetgraph() {
        let o = read("o")

        m.selection = o.selection.map(m.supergraph.getnode)
        d3.zip(m.majors, o.majors).forEach(([maj, loaded]) => Object.assign(maj, loaded))

        this.updateslectiondistances()

        m.netgraph.nodes = o.netnodes.map(loadednode => Object.assign(m.supergraph.getnode(loadednode.id), loadednode))
        m.netgraph.links = o.netlinks.map(l => m.supergraph.links.find(ll => ll.source == l.source && ll.target == l.target))

        updateview("article")
    }

    printhfs(msg?) {
        //console.log("printhfs", msg)
        for (let n of m.netgraph.nodes) {
            //console.log("netnode", n.id)
            //if (n.highlight) console.log("high", n.id)
            //if (n.focused) console.log("focs", n.id)
        }
    }
}

function read(name){
    return JSON.parse(localStorage.getItem(name) ?? "")
}

export let c = new Controller()

mount({ c, read })

// make a copy of node for force
// make a link of node for force