import { FishLink } from '../analysis/fishlink'
import { FishNode } from '../analysis/fishnode'
import { getPathsHierarchy } from '../comp/hierarchyview'
import { mc1 } from '../data/data.min'
import * as d3 from 'd3'
import { mount } from '../utils/common'
import { Controller } from './controller'
import { m } from './model'

//let c = new Controller()
//c.setfocus("Amanda Mckenzie")
//let data = getPathsHierarchy()
let nodes = mc1.nodes as any[] //.map(FishNode.create)
let links = mc1.links as any[] //.map(FishLink.create)

const width = 200
const height = 400
const w2 = width / 2
const h2 = height / 2
const padding = 40

const radius = 15
const maxy = height - radius
const minx = radius
const maxx = width - radius

nodes.forEach(
    n => ((n as any).x = Math.random() * (width - 2 * padding) + padding)
)
nodes.forEach(
    n => ((n as any).y = Math.random() * (height - 2 * padding) + padding)
)

console.log(nodes.map(n => n.x))

console.log(structuredClone(nodes))

const svg = d3
    .select(document.body)
    .append('svg')
    .attr('viewBox', [0, 0, width, height])
    .style('width', width)
    .style('height', height)

let node = svg
    .selectAll('circle')
    .data(nodes)
    .join('circle')
    //.data(undefined, d => console.log(d))
    //.data(d => d.x = Math.random() * width)
    .attr('r', radius)
    .attr('cy', '50')
    .text(d => d.nid)

const simulation = d3
    .forceSimulation()
    .nodes(nodes)
    //.force('charge', d3.forceManyBody())
    //.force('center', d3.forceCenter(width / 2, height / 2))
    // .force('link', d3.forceLink(links).id(n => n.id))
    .force('collide', d3.forceCollide().radius(radius).strength(0.21))
    .force('gravity', d3.forceY(height - radius).strength(0.1))
    .force('box', boxingForce)
    //    .stop()
    .on('tick', ontick)

function ontick() {
    console.log('ontick')
    // link.attr('x1', d => d.source.x)
    //     .attr('y1', d => d.source.y)
    //     .attr('x2', d => d.target.x)
    //     .attr('y2', d => d.target.y)
    node.attr('cx', d => d.x).attr('cy', d => d.y)
}

ontick()

function tick() {
    simulation.tick()
    ontick()
}

const bbox = [100, 200]

function boxingForce(alpha) {
    //    console.log('boxing')
    for (let node of nodes) {
        let x = node.x,
            y = node.y

        node.x = node.x.clamp(minx, maxx)
        node.y = node.y.clamp(undefined, maxy)
    }
}

// window.setInterval(tick, 100)

mount({ svg, node, mc1, nodes, links, ontick, simulation, tick })

