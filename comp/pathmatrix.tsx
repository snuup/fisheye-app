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

    svg
        .selectAll('g')
        .data(indexes)
        .join('g')
        .attr("width", cellsize)
        .attr("height", cellsize)
        //.attr("transform", `translate(${[cellsize / 2 + , cellsize / 2]})`)
        .attr("transform", ([x, y]) => `translate(${[cellsize / 2 + x * cellsize, cellsize / 2 + y * cellsize]})`)
        .append('circle')
        .attr("r", cellsize / 2)

    // let rows = svg
    //     .selectAll('g')
    //     .data(indexes)
    //     .join('g')
    //     .attr("width", cellsize)
    //     .attr("height", cellsize)
    //     .attr("transform", ([x, y]) => `translate(${[x * cellsize, y * cellsize]})`)
    //     .append('text')
    //     .text(d => d.toString())
}

export const PathMatrix = () => {
    return (
        <div class='path-matrix'  >
            <svg patch={rund3}></svg>
        </div>
    )
}

// mount({  })

