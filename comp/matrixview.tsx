import { m } from '../app/model'
import { jsx } from '../jmx-lib/core'
import * as d3 from 'd3'

export const MatrixView = () => {
    return (
        <div>
            <h2>matrix view!</h2>
            <PathMatrix />
        </div>
    )
}

const PathMatrix = () => {
    function rund3(e) {
        console.log('rund3 in matrixview')

        let rows =
            d3.select(e)
                .selectAll('tr')
                .data(m.tops)
                .join('tr')

        rows.append('td')
            .append("a")
            .attr("href", d => "/graph/" + encodeURI(d.id))
            .text(d => d.id + " " + d.degree)
            .attr('class', 'nid')

        rows.selectAll('p')
            .data(d => m.investigatees.map(inv => [inv, d.pathsByInv[inv]]))
            .join('td')
            .text(([inv, paths]) => {
                return `${paths?.first.length ?? 0}` // ${inv.id}
            })
    }

    return <div class='matrix' patch={rund3} />
}

// visualize that paths