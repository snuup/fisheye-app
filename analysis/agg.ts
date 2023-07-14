import { m } from "../app/model"
import { mount } from "../utils/common"
import { FishLink } from "../elements/fishlink"
import { FishNode } from "../elements/fishnode"
import { Graph } from "../elements/graph"
import { SuperLink } from "../elements/superlink"


class AggregatedNode implements INode {

    constructor(public fnodes: FishNode[]) { }
    get id() { return this.fnodes.map(n => n.id).sort().join() }
}

class AggregatedLink implements ILink {

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

let ag: Graph<AggregatedNode, AggregatedLink> = Graph.Empty

export class AggregateGraphBuilder {

    static create(g: Graph<FishNode, SuperLink>): Graph<AggregatedNode, AggregatedLink> {

        // let ilinks = g.innerlinks(m.majors)
        // tbd

        // ...

        let vs = Object.values({ a:"1", b:45 })
        let vs3 = ({ a:"1", b:45 }).values
        let vs2 = Object.assign({}, { a:"1", b:45 } as any).keys


        let innernodes = g.joinablenodes()
        let anodes: string[] = []
        let alinks: [string, string][] = []
        let hidelinks: [string, string][] = []
        let addlinks = innernodes.values.map(a => {
            let commonneighbors = a.first.neighbors
            let [n1, n2] = commonneighbors
            let an = commonneighbors.join("+")
            anodes.push(an)
            alinks.push([n1, an])
            alinks.push([an, n2])

        })
        let remlinks = innernodes.values.flat().flatMap(n => g.getlinks(n.n.id).map(dl => dl.link))

        let s = new Set(remlinks)

        let links =
            g.links.filter(l => !s.has(l)).map(l => new AggregatedLink(l.source, l.target))
                .concat(addlinks)

        // aggregate the nodes !!

        //return new Graph<AggregatedLink>()

        mount({ g, innernodes, links, addlinks, remlinks })

        return Graph.Empty
    }

    static run() {

        AggregateGraphBuilder.create(m.netgraph)

    }
}

mount({ AggregateGraphBuilder })


