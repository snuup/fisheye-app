import * as d3 from 'd3'
import { jsx } from '../jmx-lib/core'
import { m } from '../app/model'
import { c } from '../app/controller'
import { FishNode } from '../elements/fishnode'
import { Path } from '../elements/path'
import { SuperLink } from '../elements/superlink'

const cellsize = 30

// 2 nodes means 1 hop, so 2 means path length 1
const opacityScaler = d3.scaleLinear([0, 1, 2, 4, 10], [.2, 1, 1, 0.2, 0.1])

function rund3(e: SVGElement) {

    console.log("patch path-matrix!")

    let nodes = m.pinnednodes
    let n = nodes.length
    let svgsize = cellsize * n

    let svg = d3
        .select(e)
        .style('width', svgsize + 300) // add 300 for labels
        .style('height', svgsize)

    let cells = svg
        .selectAll('g')
        .data(m.pathmatrix)
        .join('g')
        .attr("transform", ps => `translate(${[ps.i * cellsize, (ps.j + 1) * cellsize]})`)
        .attr("opacity", ps => opacityScaler(ps.pathlength))
        .on("pointerdown", (_, ps) => c.togglepaths(ps))
        .classed("sel", ps => m.pinnedpaths.includes(ps.key))

    let texts = svg
        .selectAll('text')
        .data(nodes.slice(0, -1))
        .join('text')
        .attr("transform", (_, i) => `translate(${[n * cellsize, (i + 1) * cellsize]})`)
        .text(d => d.id)
        .attr("class", "label")

    cells
        .append('circle')
        .attr("r", p => cellsize / 2)// * 1 / Math.sqrt(p.length - 1))

    cells
        .append('text')
        .text(ps => ps.pathlength ?? "*")

    cells
        .append('title')
        .text(ps => `${ps.firstpathtext} (${ps.pathlength || "-"})`)
}

export const PathMatrix = () => {
    return (
        <div class='path-matrix'  >
            <svg patch={rund3}></svg>
        </div>
    )
}

export class Paths {

    constructor(
        public ps: Path<SuperLink>[],
        public i: number,
        public j: number,
        public n1: FishNode,
        public n2: FishNode) {}

    get key() { return this.n1.id + "-" + this.n2.id }

    get pathlength() { return this.ps.length ? this.ps.first.length : 10 }
    get pathlengthtext() { return this.ps.length ? this.ps.first.length.toString() : "*" }
    get firstpathtext() { return this.ps.first?.asText ?? `no path ${this.n1.id} -> ${this.n2.id}` }
    get count() { return this.ps.length }
}
