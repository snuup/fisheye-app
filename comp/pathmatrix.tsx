// paint first row

import * as d3 from 'd3'
import { jsx } from '../jmx-lib/core'
import { m } from '../app/model'
import { mount } from '../utils/common'

const cellsize = 14

function rund3(e: SVGElement) {

    console.log("patch path-matrix!")

    let nodes = m.netgraph.nodes
    let n = nodes.length
    let svgsize = cellsize * n

    const svg = d3
        .select(e)
        .style('width', svgsize)
        .style('height', svgsize)
        .attr('class', 'path-matrix')

}

export const PathMatrix = () => {
    return (
        <div class='path-matrix'  >
            <svg patch={rund3}></svg>
        </div>
    )
}

// mount({  })

