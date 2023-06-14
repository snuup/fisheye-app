import { jsx } from 'jmx/core'
import { m } from './model'
import { Degree } from '../analysis/graph'

export const GraphStats = () => {
    let g = m.graph
    let s = m.graph.stats
    return (
        <article>

            <h2>graph statistics</h2>
            <div>{g.nodes.length} nodes</div>
            <div>{g.links.length} links</div>

            <h3>node types</h3>
            <div>{<ObjectAsTable o={g.nodecountsByType} />}</div>

            <h3>link types</h3>
            <div>{<ObjectAsTable o={g.linkcountsByType} />}</div>

            <h3>degrees</h3>
            <div class='degreecontainer'>{g.gettopdegrees().map(DegreeView)}</div>

        </article>
    )
}

const NodeName = ({ nid }: { nid: string }) => {
    let red = m.investigatees.includes(nid)
    return <span class={cc('nodename', { red })}>{nid}</span>
}

const DegreeView = (n: FishNode) => (
    <div class='degree'>
        <Donut
            data={n.outlinks?.countBy(l => l.type)
                .entries.map(([type, value]) => ({ type, value }))}
        />
        <NodeName nid={n.id} />
        <span>{n?.type}</span>
        <span>{n.country}</span>
    </div>
)

const ObjectAsTable = ({ o }: { o: any }) => (
    <table>
        {Object.entries(o)
            .sortBy(([k, v]) => -v)
            .map(([k, v]) => (
                <tr class={k}>
                    <td>{k}</td>
                    <td>{v}</td>
                </tr>
            ))}
    </table>
)

const Bar = ({ value, classname }: { value: number; classname?: string }) => (
    <div class='bar' style={'width:20px'}>
        bar{value}
    </div>
)

import * as d3 from '../lib/d3'
import { mount } from 'jmx/util/common'
import { Donut } from '../visuals/pie'
import { cc } from '../utils/common'
import { FishNode } from '../analysis/fishnode'
mount({ d3 })
