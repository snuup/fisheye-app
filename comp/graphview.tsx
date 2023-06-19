import { m } from '../app/model'
import { When, jsx } from '../jmx-lib/core'
import * as d3 from '../lib/d3'
import { NodeView } from './node-view'

export const GraphView = () => {
    console.log(m.graphfocus, m.graphfocusnode)

    return (
        <div id='graphview'>
            <div class='overlay'>
                <h2>graph view!</h2>
                {m.graphfocusnode && <NodeView n={m.graphfocusnode} />}
            </div>
            <NodeLinkView />
        </div>
    )
}

const NodeLinkView = () => {
    function rund3(e) {
        console.log('rund3 in graphview')

        let svg = e.querySelector("svg") ? d3.select(e).select("svg") : d3.select(e).append("svg")
        let svgdom = e.querySelector('svg')

        let w = svgdom.clientWidth
        let h = svgdom.clientHeight

        console.log(w, h)

        // let rows =
        //     d3.select(e)
        //         .selectAll('tr')
        //         .data(m.tops)
        //         .join('tr')

        // rows.append('td')
        //     .text(d => d.id + " " + d.degree)
        //     .attr('class', 'nid')

        // rows.selectAll('p')
        //     .data(d => m.investigatees.map(inv => [inv, d.pathsByInv[inv.id]]))
        //     .join('td')
        //     .text(([inv, paths]) => {
        //         return `${paths?.first.length ?? 0}` // ${inv.id}
        //     })
    }

    return <div class='nodelink' patch={rund3} />
}

// visualize that paths
