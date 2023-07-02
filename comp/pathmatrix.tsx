// paint first row

import * as d3 from 'd3'
import { jsx } from '../jmx-lib/core'
import { m } from '../app/model'
import { mount } from '../utils/common'

const cellsize = 30

function rund3(e: SVGElement) {

    console.log("patch path-matrix!")

    let nodes = m.netgraph.nodes
    let n = nodes.length
    let svgsize = cellsize * n
    let indexes = d3.range(n).flatMap(x => d3.range(x).map(y => [x, y]))
    console.log(indexes)

    let svg = d3
        .select(e)
        .style('width', svgsize)
        .style('height', svgsize)
        .attr('class', 'path-matrix')

    let cells = svg
        .selectAll('g')
        .data(indexes)
        .join('g')
        .attr("transform", ([x, y]) => `translate(${[x * cellsize, ++y * cellsize]})`)

    cells
        .append('circle')
        .attr("r", cellsize / 2)

    cells
        .append('text')
        .text(d => d.toString())
}

export const PathMatrix = () => {
    return (
        <div class='path-matrix'  >
            <svg patch={rund3}></svg>
        </div>
    )
}

// mount({  })

