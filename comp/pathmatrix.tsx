// paint first row

import * as d3 from 'd3'
import { jsx } from '../jmx-lib/core'
import { m } from '../app/model'
import { mount } from '../utils/common'
import { c } from '../app/controller'
import { NodePath } from '../analysis/graph'

const cellsize = 30

// 2 nodes means 1 hop, so 2 means path length 1
const opacityScaler = d3.scaleLinear([0, 1, 2, 4, 10], [.2, 1, 1, 0.2, 0])

function rund3(e: SVGElement) {

    console.log("patch path-matrix!")

    let g = m.netgraph
    let nodes = g.nodes
    let n = nodes.length
    let svgsize = cellsize * n
    let indexes = d3.range(n).flatMap(x => d3.range(x).map(y => [x, y]))
    //console.log(indexes)

    // compute matrix
    function computepaths(i) : NodePath[] {
        let { goalpaths } = g.findpathsmulti(nodes[i], nodes.slice(i + 1))
        console.log("computepaths", goalpaths)
        return goalpaths
    }

    let allpaths = d3.range(n).flatMap(computepaths)
    console.log("allpaths", allpaths)
    mount({ allpaths })

    function getpaths([i1, i2]): NodePath[] {
        let n1 = nodes[i1]
        let n2 = nodes[i2]
        return allpaths.filter(p => p.last == n1 && p.first == n2)
    }

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
        .datum(d => getpaths(d as [number, number]))
        .attr("opacity", p => opacityScaler(p.length))
        .on("click", (_, paths) => c.addpath2netgraph(paths))

    cells
        .append('circle')
        .attr("r", p => cellsize / 2)// * 1 / Math.sqrt(p.length - 1))

    cells
        .append('text')
        .text(ps => ps.first?.length ?? "*")

    cells
        .append('title')
        .text(ps => `${ps.first?.asText ?? "-"} (${ps.length || "-"})`)
}

export const PathMatrix = () => {
    return (
        <div class='path-matrix'  >
            <svg patch={rund3}></svg>
        </div>
    )
}

// mount({  })
