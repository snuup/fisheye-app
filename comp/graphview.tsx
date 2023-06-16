import { m } from '../app/model'
import { jsx } from '../jmx-lib/core'
import * as d3 from '../lib/d3'

export const GraphView = () => {
    return (
        <div>
            <h3>graph view!</h3>
            <PathMatrix />
        </div>
    )
}

const PathMatrix = () => {
    function rund3(e) {
        console.log('rund3 in graphview')

        let rows = d3
            .select(e)
            .selectAll('div')
            .data(m.tops)
            .join('div')
            .text(d => d.id)
            .attr("class", "nid")

        rows
            .selectAll('p')
            .data(d => d.paths.groupBy(p => p.source).entries)
            .join('p')
            .text(([name, paths]) => `${paths.first.length} ${name} ${paths.length}`)
    }

    return <div patch={rund3} />
}
