import { jsx, jsxf } from "../jmx-lib/core"
import { cc, mount, nicelinktypename, nicenodetypename } from '../utils/common'
import { m } from '../app/model'
import * as d3 from 'd3'
import { FishNode } from '../elements/fishnode'
import { NodeDonut } from './node-donut'
import { NameValue } from "./namevalue"
import { NodeIdBarChart } from "./nodebarcharts"

mount({ d3 })

export const NodeStats = () => {
    let g = m.graph
    return (
        <div class="stats">
            <h2>graph statistics</h2>

            <div class="stats-top">
                <div>
                    <h3>counts</h3>
                    {<ObjectAsTable o={{
                        nodes: g.nodes.length,
                        links: g.links.length
                    }} />}
                </div>

                <div>
                    <h3>node types</h3>
                    {<ObjectAsTable o={g.nodecountsByType.mapKeys(nicenodetypename)} />}
                </div>

                <div>
                    <h3>link types</h3>
                    {<ObjectAsTable o={g.linkcountsByType.mapKeys(nicelinktypename)} />}
                </div>

                <div>
                    <h3>node properties</h3>
                    <NodeIdBarChart />
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

const ObjectAsTable = ({ o }: { o: any }) => (
    <div class="gridtable">
        {o.entries
            .sortBy(([k, v]) => -v)
            .map(([k, v]) => <NameValue name={k} value={v} className={k} />)
        }
    </div>
)

// const Bar = ({ value, classname }: { value: number; classname?: string }) => (
//     <div class='bar' style={'width:20px'}>
//         bar{value}
//     </div>
// )
