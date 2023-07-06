import * as fs from "fs"
import { mc1 } from "../data/data"
import { linktypes } from "../elements/fishnode"
import { DirectedLink } from "../elements/fishlink"

let lm = new Map<string, DirectedLink<ILink>[]>()
for (let l of mc1.links) {
    lm.getorcreate(l.source, () => []).push(new DirectedLink(l, false))
    lm.getorcreate(l.target, () => []).push(new DirectedLink(l, true))
}

function getlinks(nid: string): DirectedLink<ILink>[] { return lm.get(nid) ?? [] }

function computenode(n: any) {
    let counts = getlinks(n.id).groupBy(dl => dl.link.type)
    n.donut = linktypes.map(type => {
        let all = counts?.[type] ?? []
        let bydirection = all.groupBy(dl => dl.rev.toString())
        let outs = bydirection?.false?.length ?? 0
        let ins = bydirection?.true?.length ?? 0
        return { type, outs, ins, total: outs + ins }
    })
}

mc1.nodes.forEach(computenode)

fs.writeFileSync("out.json", JSON.stringify(mc1))

console.log("dono says the hop")
