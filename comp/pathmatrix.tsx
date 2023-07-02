// paint first row

import * as d3 from 'd3'
import { jsx } from '../jmx-lib/core'
import { m } from '../app/model'
import { mount } from '../utils/common'

const cellsize = 30

const opacityScaler = d3.scaleLinear([1, 4, 10], [1, 0.1, 0])

function rund3(e: SVGElement) {

    console.log("patch path-matrix!")

    let g = m.netgraph
    let nodes = g.nodes
    let n = nodes.length
    let svgsize = cellsize * n
    let indexes = d3.range(n).flatMap(x => d3.range(x).map(y => [x, y]))
    //console.log(indexes)

    // compute matrix
    const computepaths = (i) => {
        let { goalpaths } = g.findpathsmulti(nodes[i], nodes.slice(i + 1))
        return goalpaths
    }
    let allpaths = d3.range(n).flatMap(computepaths)
    console.log("allpaths", allpaths)
    mount({ allpaths })

    const getpath = ([i1, i2]) => {
        let n1 = nodes[i1]
        let n2 = nodes[i2]
        console.log("getpath", n1, n2)
        return allpaths.find(p => p.last == n1 && p.first == n2) // ?.length?.toString() ?? "?"
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
        .datum(d => getpath(d))
        .attr("opacity", p => opacityScaler(p?.length ?? 100))
        .on("click", (_, d) => console.log(d))

    cells
        .append('circle')
        .attr("r", cellsize / 2)

    cells
        .append('text')
        .text(p => p?.length ?? 100)

    cells
        .append('title')
        .text(p => p!.map(n => n.id).join(" > "))
}

export const PathMatrix = () => {
    return (
        <div class='path-matrix'  >
            <svg patch={rund3}></svg>
        </div>
    )
}

// mount({  })

