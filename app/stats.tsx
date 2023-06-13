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
            <ul>
                {s.degrees.map(d => (
                    <li>{DegreeView(d)}</li>
                ))}
            </ul>
        </article>
    )
}

const DegreeView = (d: Degree) => (
    <div>
        <div>
            ({d.count}) {d.nid} {d.links.countBy(l => l.type).entries.map(([k, v]) => `(${v}) ${k.trim()}`).join(" ")}
        </div>
    </div>
)

