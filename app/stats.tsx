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
            <table>
                {s.degrees.map(DegreeView)}
            </table>
        </article>
    )
}

const DegreeView = (d: Degree) => (
    <tr>
        <td>({d.count})</td>
        <td>{d.nid}</td>
        <td>
            {d.links
                .countBy(l => l.type)
                .entries.map(([k, v]) => `(${v}) ${k.trim()}`)
                .join(' ')}
        </td>
    </tr>
)
