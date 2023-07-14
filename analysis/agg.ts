import { FishGraph, m } from "../app/model"
import { mount } from "../utils/common"
import { FishLink } from "../elements/fishlink"
import { FishNode } from "../elements/fishnode"
import { Graph } from "../elements/graph"
import { SuperLink } from "../elements/superlink"


export class AggregatedNode implements INode {
    id: string
    constructor(public fnodes: FishNode[]) {
        this.id = this.fnodes.map(n => n.id).sort().join()
        console.log("ctor AggregatedNode", this.id)
    }
}

export class AggregatedLink implements ILink {

    constructor(
        public source: string,
        public target: string,
        public type = "no-type",
        public weight = 0
    ) { }

    //get source() { return this.links.first.source }
    //get target() { return this.links.first.target }
    //get type() { return this.links.map(l => l.type).join() }
    //get weight() { return this.links.map(l => l.weight).sumBy() }
    get text() { return "link-text" }
    get nodeids(): [string, string] { return [this.source, this.target] }
}


mount({ AggregatedNode, AggregatedLink })

// class AggregatedLink implements ILink {

//     constructor(public links: FishLink[]) { }

//     get source() { return this.links.first.source }
//     get target() { return this.links.first.target }
//     get type() { return this.links.map(l => l.type).join() }
//     get weight() { return this.links.map(l => l.weight).sumBy() }
//     get text() { return this.links.map(l => l.text).join() }
//     get nodeids() { return this.links.first.nodeids }
// }

export type AGraph = Graph<AggregatedNode, AggregatedLink>

//let ag: Graph<AggregatedNode, AggregatedLink> = Graph.Empty

export class AggregateGraphBuilder {

    static sync(ag: AGraph, g: FishGraph): void {

        let innernodegroups = g.joinablenodes()

        let snodes = [...g.nodes]
        let slinks = [...g.links]

        function ensurenode(...fns: FishNode[]) {
            let id = fns.map(fn => fn.id).join()
            if (!ag.hasnode(id)) ag.addnode(new AggregatedNode(fns))
        }
        function ensurelink(n1, n2) {
            if (!ag.haslink([n1, n2])) ag.appendlink(new AggregatedLink(n1, n2))
        }

        innernodegroups.values().map(innernodes => {
            let commonneighbors = innernodes.first.neighbors
            let [n1, n2] = commonneighbors
            let an = commonneighbors.join("+")


            let ns = innernodes.map(({ n }) => n)
            ensurenode(...ns)
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

        mount({ snodes, innernodegroups })
    }

    static run() {

        AggregateGraphBuilder.sync(m.agraph, m.netgraph)

    }
}

mount({ AggregateGraphBuilder })
