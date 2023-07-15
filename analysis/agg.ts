import { FishGraph, m } from "../app/model"
import { mount } from "../utils/common"
import { FishLink } from "../elements/fishlink"
import { FishNode } from "../elements/fishnode"
import { Graph } from "../elements/graph"
import { SuperLink, TypeCount } from "../elements/superlink"


export class ANode implements INode {

    id: string

    constructor(public fnodes: FishNode[]) {
        this.id = this.fnodes.map(n => n.id).sort().join()
        console.log("ctor AggregatedNode", this.id)
    }

    get f1() { return this.fnodes.first }
    get type() { return this.fnodes.map(n => n.type).join() }

    get donut() { return this.f1.donut }
    highlight = false
    focused = false
}

export class ALink implements ILink {

    highlight = false

    constructor(
        public source: string,
        public target: string,
        public type = "no-type",
    ) { }

    get typeCountsPerSide() : any[] {
        // let outs = this.getTypeCounts(this.outlinks, "out")
        // let ins = this.getTypeCounts(this.inlinks, "in")
        // return [outs, ins].filter(a => a.length).map(tcs => ({ tcs, sl: this }))
        return []
    }

    //get source() { return this.links.first.source }
    //get target() { return this.links.first.target }
    //get type() { return this.links.map(l => l.type).join() }
    //get weight() { return this.links.map(l => l.weight).sumBy() }
    get text() { return "link-text" }
    get nodeids(): [string, string] { return [this.source, this.target] }
    get weight() { return 1 }
}


mount({ ANode: ANode, ALink: ALink })

// class AggregatedLink implements ILink {

//     constructor(public links: FishLink[]) { }

//     get source() { return this.links.first.source }
//     get target() { return this.links.first.target }
//     get type() { return this.links.map(l => l.type).join() }
//     get weight() { return this.links.map(l => l.weight).sumBy() }
//     get text() { return this.links.map(l => l.text).join() }
//     get nodeids() { return this.links.first.nodeids }
// }

export type AGraph = Graph<ANode, ALink>

//let ag: Graph<AggregatedNode, AggregatedLink> = Graph.Empty

class AggregateGraphBuilder {

    static sync(ag: AGraph, g: FishGraph): void {

        console.log("sync agraph")


        let innernodegroups = g.joinablenodes()
        mount({ innernodegroups })

        let snodes = [...g.nodes]
        let slinks = [...g.links]

        let newnodes = new Set<string>()

        function ensurenode(...fns: FishNode[]) {
            let n = new ANode(fns)
            newnodes.add(n.id)
            if (!ag.hasnode(n.id)) ag.addnode(n)
            return n.id
        }
        function ensurelink(n1, n2) {
            if (!ag.haslink([n1, n2])) ag.appendlink(new ALink(n1, n2))
        }

        innernodegroups.values().map(innernodes => {
            let commonneighbors = innernodes.first.neighbors
            let [n1, n2] = commonneighbors

            let ns = innernodes.map(({ n }) => n)
            let an = ensurenode(...ns)
            snodes.remove(...ns)

            ensurelink(n1, an)
            ensurelink(an, n2)

            for (let dl of innernodes.flatMap(({ n }) => m.netgraph.getlinks(n.id))) {
                let l = dl.link
                slinks.remove(l)
            }
        })

        snodes.forEach(sn => ensurenode(sn))
        slinks.forEach(sl => ensurelink(sl.source, sl.target))

        let removals = ag.nodes.filter(n => !newnodes.has(n.id))
        console.log({ removals })

        mount({ snodes, innernodegroups })
    }

    static run() {

        AggregateGraphBuilder.sync(m.agraph, m.netgraph)

    }
}

mount({ AggregateGraphBuilder })
