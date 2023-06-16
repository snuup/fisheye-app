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

        let rows = d3.select(e).selectAll('tr').data(m.tops).join('tr')

        rows.append('td')
            .text(d => d.id + " " + d.degree)
            .attr('class', 'nid')

        rows.selectAll('p')
            .data(d => m.investigatees.map(inv => [inv, d.pathsByInv[inv.id]]))
            .join('td')
            .text(([inv, paths]) => {
                return `${paths?.first.length ?? 0}` // ${inv.id}
            })
    }

    return <div class='matrix' patch={rund3} />
}
