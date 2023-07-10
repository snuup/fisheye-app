import { jsx } from "../jmx-lib/core"
import { cc, mount, nicenodetypename } from '../utils/common'
import { m } from '../app/model'
import { FishNode } from '../elements/fishnode'
import { NodeDonut } from './node-donut'
import { mc1 } from "../data/data"
import { ObjectAsTable } from "./namevalue"

export const NodeStats = () => {
    let g = m.graph

    let o: { country: number, id: number, type: number } = mc1.nodes.flatMap(n => n.keys).countBy()
        delete (o as any).donut
        let propertystats =
        {
            total: mc1.nodes.length as number,
            id: o.id,
            type: o.type,
            country: o.country
        }

    return (
        <div class="stats">
            <h2>node statistics</h2>

            <div class="stats-top">
                <div>
                    <h3>counts</h3>
                    {<ObjectAsTable o={{
                        nodes: g.nodes.length,
                        links: g.links.length
                    }} />}
                </div>

                <div>
                    <h3>node properties</h3>
                    {<ObjectAsTable o={propertystats} showbars={true} />}
                    {/* <NodeIdBarChart /> */}
                </div>

                <div>
                    <h3>node types</h3>
                    {<ObjectAsTable o={g.nodecountsByType.mapKeys(nicenodetypename)} multiplier={1} showbars={true} />}
                </div>

            </div>

            <div class="topdegrees">
                <h3>top 25 nodes with heighest degrees</h3>
                <div class='degreecontainer'>
                    {g.gettopdegrees().map(n => DegreeView(n))}
                </div>
            </div>

        </div>
    )
}

const NodeName = ({ nid }: { nid: string }) => {
    let red = m.investigatees.find(n => n === nid)
    return <span class={cc('nodename', { red })}>{nid}</span>
}

const DegreeView = (n: FishNode) => (
    <div class='degree'>
        <NodeDonut n={n} />
        <NodeName nid={n.id} />
        <span>{n?.type}</span>
        <span>{n.country}</span>
    </div>
)

