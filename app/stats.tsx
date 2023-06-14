import { jsx } from 'jmx/core'
import { m } from './model'
import { Degree } from '../analysis/graph'

export const GraphStats = () => {
    let s = m.graph.stats
    return (
        <article>
            <h2>stats</h2>
            <div>{s.nodecount} nodes</div>
            <div>{s.linkcount} links</div>
            <h3>node types</h3>
            <div>{<ObjectAsTable o={s.nodetypes} />}</div>
            <h3>link types</h3>
            <div>{<ObjectAsTable o={s.linktypes} />}</div>
            <h3>degrees</h3>
            <div class='degreecontainer'>{s.degrees.map(DegreeView)}</div>
        </article>
    )
}

const NodeName = ({ nid }: { nid: string }) => {
    let red = m.investigatees.includes(nid)
    return <span class={cc('nodename', { red })}>{nid}</span>
}

const DegreeView = (d: Degree) => (
    <div class='degree'>
        <Donut
            data={d.links
                .countBy(l => l.type)
                .entries.map(([type, value]) => ({ type, value }))}
        />
        <NodeName nid={d.nid} />
        <span>{m.graph.getnode(d.nid)?.type}</span>
        <span>{m.graph.getnode(d.nid)?.original?.country}</span>
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
mount({ d3 })
