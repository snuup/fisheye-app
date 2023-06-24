import * as d3d from 'd3-force-3d'
import * as d3 from 'd3'
import { mc1 } from '../data/data'
import { jsx } from '../jmx-lib/core'

const xlength = 600
const ylength = 400
const zlength = 150

const radius = 8

const xscaler = d3.scaleLinear([0, 100], [radius, xlength - radius])
const yscaler = d3.scaleLinear([0, 100], [radius, ylength - radius])
const zscaler = d3.scaleLinear(
    [0, 50, 100],
    [radius, zlength * 0.75, zlength - radius]
)
const opacityscaler = d3.scaleLinear([0, 100], [1, 0])

const randscale = d3.scaleLinear([0, 1], [0, 100])
function rand100() {
    return randscale(Math.random())
}

interface Node {
    id
    x
    y
    z
    up?
    vz?
}

function rund3(e: HTMLElement) {
    const svg1 = d3
        .select(e)
        .append('svg')
        .attr('class', 'xy')
        .attr('viewBox', [0, 0, xlength, ylength])
        .style('width', xlength)
        .style('height', ylength)

    const svg2 = d3
        .select(e)
        .append('svg')
        .attr('class', 'xz')
        .attr('viewBox', [0, 0, xlength, zlength])
        .style('width', xlength)
        .style('height', zlength)

    let nodes: Node[] = mc1.nodes
        .slice(0, 500)
        .map(n => ({ id: n.id, x: rand100(), y: rand100(), z: 0 }))

    let nodesxy = svg1
        .selectAll('circle')
        .data(nodes)
        .join('circle')
        .attr('r', radius)

    let nodesxz = svg2
        .selectAll('circle')
        .data(nodes)
        .join('circle')
        .attr('r', radius)

    const simulation = d3d
        .forceSimulation(nodes, 3)
        // .force('link', d3.forceLink(links).id(n => n.id))
        .force('collide', d3d.forceCollide().radius(radius).strength(0.05))
        .force('z', d3d.forceZ(100).strength(0.02))
        .force('up-force', forceup)
        .force('box', boxingForce)
        .on('tick', updateview)

    function forceup(alpha) {
        for (let n of nodes.filter(n => n.up)) {
            n.vz += (0 - n.z) * n.up * 0.2 * alpha
        }
    }

    function boxingForce(alpha) {
        for (let node of nodes) {
            node.x = node.x.clamp(0, 100)
            node.y = node.y.clamp(0, 100)
            node.z = node.z.clamp(0, 100)
        }
    }

    function updateview() {
        console.log('ontick')
        // link.attr('x1', d => d.source.x)
        //     .attr('y1', d => d.source.y)
        //     .attr('x2', d => d.target.x)
        //     .attr('y2', d => d.target.y)
        nodesxy
            .attr('cx', d => xscaler(d.x))
            .attr('cy', d => yscaler(d.y)) // .attr("opacity",)
            //.attr('r', d => rscaler(d.z))
            .style('opacity', d => opacityscaler(d.z))

        nodesxz
            .attr('cx', d => xscaler(d.x))
            .attr('cy', d => zscaler(d.z))
            .style('opacity', d => 1 - opacityscaler(d.y))
    }
}

export const SeaView = () => {
    return <div class='seaview' patch={rund3} />
}

// function reheat() {
//     simulation.alpha(.5)
//     simulation.restart()
// }

// mount({ d3, nodes, simulation, updateview, reheat })
