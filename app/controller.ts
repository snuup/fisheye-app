import * as d3 from "d3"
import { initrouter } from "../jmx-lib/router"
import { updateview, updateviewmany } from "../jmx-lib/core"
import { mc1 } from "../data/data"
import { mount, rebind } from "../utils/common"
import { mraw as m } from "./model"
import { Graph, GraphAlgos, printpath } from "../elements/graph"
import { FishNode, FishNodeForce } from "../elements/fishnode"
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
        if (typeof start !== "string") throw "start must be a string"
        if (typeof goal !== "string") throw "goal must be a string"
        return GraphAlgos.getdistance(m.supergraph.getneighbors, start, goal, 90, ["FishEye International"])
    }

    getrankedneighbors() {
        let scores = new Map<string, number>()
        let inc = (id, distance) => {
            let score = scores.get(id) ?? 0
            score += 1 / distance
            scores.set(id, score)
        }
        for (let n of m.selection) {
            let fs = c.getfronteers(n.id, 3)
            fs.forEach((fronteer, i) => fronteer.forEach(fn => inc(fn, i + 1)))
        }
        m.scores = { selection: [...m.selection].mapids(), scores }

        m.rankedscores =
            [...m.scores.scores]
                .sortBy(kv => -kv[1])
                .slice(0, 100)
                .map(([id, score]) => ({
                    id,
                    score,
                    node: m.graph.getnode(id),
                    distances: m.selection.map(n => c.getdistance(n.id, id))
                }))

        updateview("#scores")
    }

    setroute(ps?: PopStateEvent) {
        console.log("setroute0", ps?.state, ps)
        m.url = decodeURI(document.location.pathname).split('/').slice(1) as Url
        console.log("setroute", m.url)

        if (ps?.state) {
            this.loadpersisto(ps.state)
            m.majors.filter(n => !n.pinned).map((n: FishNodeForce) => n.fx = n.fy = undefined)
            window.setxys?.()
            window.reheat()
        }

        // debugger
        updateview(document.body, false, true)
        //updateview("header", false, false)
        //updateview('#main', undefined, true) // replace!! non replace does not work: to debug
    }

    togglenetnode(ev, n: FishNode) {
        console.log("togglenetnode")


        n.pinned = !n.pinned
        // if (n.pinned) {
        //     console.error("tbd, node untoggling")
        // } else {
        //     if (!m.majors.includes(n)) {
        //         m.netgraph.nodes.push(n)
        //         n.pinned = true
        //     }
        // }

        this.updatelinks(n)
        updateview("article")
        //window.rund3()

        history.pushState(this.getpersisto(), '', window.location.href)
    }

    updatelinks(n: FishNode) {

        console.log("updatelinks", n.id, n)

        if (n.pinned) {

            console.log("updatelinks pinned")

            m.netgraph.nodes.push(n)

            console.warn("add links between", n.id, m.netgraph.nodes)

            let paths = GraphAlgos.findpathsmulti(
                m.supergraph.getlinks,
                n.id, m.netgraph.nodes.filter(n => n.role == "inv" || n.role == "sus").concat(m.selection).mapids().except(n.id))

            if (window.all) paths = GraphAlgos.findpathsmulti(m.supergraph.getlinks, n.id, m.netgraph.nodes.map(n => n.id).except(n.id))

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
            m.netgraph.nodes = m.netgraph.nodes.distinct()
            m.netgraph.links = m.netgraph.links.distinct()

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
        //m.selection.removeif(x => x !== n).forEach(n => n.selected = false)

        this.updateslectiondistances()

        //updateview("article svg")
        window.rund3()

        m.selection.map(n => n.id).print()

        this.getrankedneighbors()
    }

    updateslectiondistances() {

        m.supergraph.nodes.forEach(n => n.suspectdistance = undefined)

        let firstselect: FishNode | undefined = m.selection[0]
        if (firstselect) {
            for (let sus of m.suspects) {
                sus.suspectdistance = c.getdistance(firstselect.id, sus.id)
            }
        }
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

    getpersisto() {
        return {
            selection: m.selection.map(n => n.id),
            majors: m.majors,
            netnodes: m.netgraph.nodes,
            netlinks: m.netgraph.links
        }
    }

    loadpersisto(o: any) {
        m.selection = o.selection.map(m.supergraph.getnode)
        d3.zip(m.majors, o.majors).forEach(([maj, loaded]) => Object.assign(maj, loaded))
        m.netgraph.nodes = o.netnodes.map(loadednode => Object.assign(m.supergraph.getnode(loadednode.id), loadednode))
        m.netgraph.links = o.netlinks.map(l => m.supergraph.links.find(ll => ll.source == l.source && ll.target == l.target))
        this.updateslectiondistances()
    }

    printhfs(msg?) {
        //console.log("printhfs", msg)
        for (let n of m.netgraph.nodes) {
            //console.log("netnode", n.id)
            //if (n.highlight) console.log("high", n.id)
            //if (n.focused) console.log("focs", n.id)
        }
    }

    save(name = "o") {
        localStorage.setItem(name, JSON.stringify(c.getpersisto()))
    }

    load(name = "o") {
        this.loadpersisto(read(name))
        updateview("article", undefined, true)
    }

    clearnet() {
        m.majors.forEach((n: FishNodeForce) => { n.pinned = false; n.fx = n.fy = undefined })
        m.netgraph = Graph.Empty
        updateview("article", undefined, true)
    }
}

function read(name) {
    return JSON.parse(localStorage.getItem(name) ?? "")
}

export let c = new Controller()

mount({ c, read })

// make a copy of node for force
// make a link of node for force