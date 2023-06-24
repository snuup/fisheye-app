import './util/common'
import * as d3d from 'd3-force-3d'
import * as d3 from 'd3'
import { mc1 } from '../data/data'
import { mount } from '../utils/common'

const xlength = 600
const ylength = 600
const zlength = 200

const radius = 8

const xscaler = d3.scaleLinear([0, 100], [radius, xlength - radius])
const yscaler = d3.scaleLinear([0, 100], [radius, ylength - radius])
const zscaler = d3.scaleLinear([0, 50, 100], [radius, zlength * 0.75, zlength - radius])
const opacityscaler = d3.scaleLinear([0, 100], [1, 0])

const svg1 = d3
    .select(document.body)
    .append('svg')
    .attr("class", "xy")
    .attr('viewBox', [0, 0, xlength, ylength])
    .style('width', xlength)
    .style('height', ylength)

const svg2 = d3
    .select(document.body)
    .append('svg')
    .attr("class", "xz")
    .attr('viewBox', [0, 0, xlength, zlength])
    .style('width', xlength)
    .style('height', zlength)

const randscale = d3.scaleLinear([0, 1], [0, 100])
function rand100() { return randscale(Math.random()) }

interface Node {
    id, x, y, z, up?, vz?
}

let nodes: Node[] = mc1.nodes.slice(0, 500).map(n => ({ id: n.id, x: rand100(), y: rand100(), z: 0 }))

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

const simulation =
    d3d.forceSimulation(nodes, 3)
        //.force('charge', d3.forceManyBody())
        //.force('center', d3.forceCenter(width / 2, height / 2))
        // .force('link', d3.forceLink(links).id(n => n.id))
        .force('collide', d3d.forceCollide().radius(radius).strength(0.05))
        //.force('x', d3d.forceX(50).strength(0.05))
        //.force('y', d3d.forceY(70).strength(0.05))
        .force('z', d3d.forceZ(100).strength(0.02))
        //.force('up-force', d3d.forceZ(0).strength(1))
        .force('up-force', forceup)
        .force('box', boxingForce)
        .on('tick', updateview)
        .on('end', report)

function forceup(alpha) {
    for (let n of nodes.filter(n => n.up)) {
        n.vz += (0 - n.z) * n.up * .2 * alpha
    }
}

function boxingForce(alpha) {
    for (let node of nodes) {
        node.x = node.x.clamp(0, 100)
        node.y = node.y.clamp(0, 100)
        node.z = node.z.clamp(0, 100)
    }
}

let count = 300

function updateview() {
    console.log('ontick')
    // if (count-- % 10 != 0) {
    //     console.log("stop!")
    //     //simulation.stop()
    //     //report()
    //     return
    // }
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

function report() {
    //    nodes.forEach(printnode)
}

function printnode(n) {
    console.log(n.x, n.y, n.z)
}

function reheat() {
    simulation.alpha(.5)
    simulation.restart()
}

mount({ d3, nodes, simulation, updateview, reheat })
