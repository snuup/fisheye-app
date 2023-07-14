import { m } from "../app/model"
import { mount } from "../utils/common"
import { FishLink } from "./fishlink"
import { FishNode } from "./fishnode"
import { Graph } from "./graph"


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

class AggregateGraphBuilder {
    static create(g: Graph<FishNode, FishLink>): Graph<AggregatedNode, AggregatedLink> {

        // let ilinks = g.innerlinks(m.majors)
        // tbd

        // ...

        let innernodes = g.joinablenodes()
        let addlinks = innernodes.values.map(a => { let [n1, n2] = a.first.neighbors; return new AggregatedLink(n1, n2) })
        let remlinks = innernodes.values.flat().flatMap(n => g.getlinks(n.n.id).map(dl => dl.link))

        let s = new Set<FishLink>(remlinks)

        let links =
            g.links.filter(l => !s.has(l)).map(l => new AggregatedLink(l.source, l.target))
            .concat(addlinks)

            // aggregate the nodes !!

        //return new Graph<AggregatedLink>()

        throw "tbd"
    }
}