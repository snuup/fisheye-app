import * as d3d from '../force/index'
import * as d3 from 'd3'
import { jsx } from '../jmx-lib/core'
import { m } from '../app/model'
import { FishNode } from '../analysis/fishnode'
import { mount } from '../utils/common'

const xlength = 600
const ylength = 400
const zlength = 150

const radius = 8

const xscaler = d3.scaleLinear([0, 100], [radius, xlength - radius])
const yscaler = d3.scaleLinear([0, 100], [radius, ylength - radius])
const zscaler = d3.scaleLinear([0, 100], [0, zlength])
// const zscaler = d3.scaleLinear(
//     [0, 50, 100],
//     [radius * .3, zlength * 1, zlength - radius]
// )
const opacityscaler = d3.scaleLinear([0, 100], [1, 0])

const randscale = d3.scaleLinear([0, 1], [0, 100])
function rand100() {
    return randscale(Math.random())
}

let simulation

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

    let links = m.subgraph.links

    const link = svg1
        .selectAll('.link')
        .data(links)
        .join(
            enter =>
                enter
                    .append('line')
                    .attr('class', 'link')
                    .attr('class', d => d.type)
                    .attr('stroke-width', 2)
                    .attr('fill', 'none'),
            //.attr('opacity', d => d.weight)
            //.on("click", e => c.selectlink(e.target.__data__)),
            update => update,

            exit => exit.remove()
        )

    let nodes = m.subgraph.nodes
    nodes.forEach(n => {
        let isinv = m.investigatees.includes(n)
        n.x = rand100()
        n.y = rand100()
        n.z = isinv ? 1 : 0
        n.isinv = isinv
        n.up = 0
    })

    let nodesxy = svg1
        .selectAll('circle')
        .data(nodes)
        .join('circle')
        .attr('r', radius)
        .classed("inv", d => (m.investigatees.includes(d)))
        .classed("focused", d => (m.graphfocusnode === d))

    nodesxy.append('title').text(d => d.id)

    let nodesxz = svg2
        .selectAll('circle')
        .data(nodes)
        .join('circle')
        .attr('r', radius)
        .classed("inv", d => (m.investigatees.includes(d)))
        .classed("focused", d => (m.graphfocusnode === d))

    nodesxz.append('title').text(d => d.id)

    simulation = d3d
        .forceSimulation(nodes, 3)
        .force('link', d3d.forceLink(links).id((n: FishNode) => n.id))
        .force('collide', d3d.forceCollide().radius(radius).strength(0.05))
        .force('z', d3d.forceZ(100).strength(0.05))
        .force('up-force', forceup)
        .force('box', boxingForce)
        .force('inv', invForce)
        .on('tick', updateview)

    function forceup(alpha) {
        for (let n of nodes.filter(n => n.up)) {
            n.vz += (0 - n.z) * n.up! * 0.2 * alpha
        }
    }

    function boxingForce(alpha) {
        for (let n of nodes) {
            n.x = n.x.clamp(0, 100)
            n.y = n.y.clamp(0, 100)
            n.z = n.z.clamp(0, 100)
        }
    }

    function invForce(alpha) {
        for (let n of m.investigatees) {
            n.z = 0
        }
        let [a, b, c, d] = m.investigatees
        a.x = 5
        b.x = 90
        c.x = 8
        d.x = 92
        a.y = 10
        b.y = 10
        c.y = 90
        d.y = 90
    }

    function updateview() {
        console.log('ontick')
        link.attr('x1', d => xscaler(d.source.x))
            .attr('y1', d => yscaler(d.source.y))
            .attr('x2', d => xscaler(d.target.x))
            .attr('y2', d => yscaler(d.target.y))
        nodesxy
            .attr('cx', d => xscaler(d.x))
            .attr('cy', d => yscaler(d.y))
            //.attr('r', d => rscaler(d.z))
            .style('opacity', d => opacityscaler(d.z))

        nodesxz
            .attr('cx', d => xscaler(d.x))
            .attr('cy', d => zscaler(d.z))
            .style('opacity', d => 1 - opacityscaler(d.y))
    }

    mount({ simulation })
}

export const SeaView = () => {
    return <div class='seaview' patch={rund3} />
}

function reheat() {
    simulation.alpha(.5)
    simulation.restart()
}

mount({ opacityscaler, zscaler, reheat })