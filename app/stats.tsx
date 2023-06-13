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
            <table>{s.degrees.map(DegreeView)}</table>
        </article>
    )
}

const DegreeView = (d: Degree) => (
    <tr>
        <td><Donut data={ d.links.countBy(l => l.type).entries.map(([type, value]) => ({ type, value })) } /></td>
        <td>({d.count})</td>
        <td>{m.investigatees.includes(d.nid) && '!'}</td>
        <td>{d.nid}</td>
        {/* <td>
            {d.links
                .countBy(l => l.type)
                .entries.map(([k, v]) => `(${v}) ${k.trim()}`)
                .join(' ')}
        </td>
        <td>
            <Bar value={15} />
        </td> */}
    </tr>
)

const ObjectAsTable = ({ o }: { o: any }) => (
    <table>
        {Object.entries(o)
            .sortBy(([k, v]) => -v)
            .map(([k, v]) => (
                <tr>
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
mount({ d3 })
